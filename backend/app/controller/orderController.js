import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Transaction from "../models/transaction.js";
import StockHistory from "../models/stockHistory.js";
import Notification from "../models/notification.js";
import Seller from "../models/seller.js";
import Delivery from "../models/delivery.js";
import handleResponse from "../utils/helper.js";

/* ===============================
   PLACE ORDER
================================ */
export const placeOrder = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { address, payment, pricing, timeSlot, items } = req.body;

        // 1. Generate unique Order ID
        const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // 2. Map items if provided, or fetch from cart if not
        let orderItems = items;
        if (!orderItems || orderItems.length === 0) {
            const cart = await Cart.findOne({ customerId }).populate("items.productId");
            if (!cart || cart.items.length === 0) {
                return handleResponse(res, 400, "Cannot place order with empty cart");
            }
            orderItems = cart.items.map(item => ({
                product: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.productId.salePrice || item.productId.price,
                image: item.productId.mainImage
            }));
        }

        // 3. Find seller from products (taking the first item's seller for simplicity)
        const firstProduct = await Product.findById(orderItems[0].product);
        const sellerId = firstProduct ? firstProduct.sellerId : null;
        console.log("Order Placement - Seller ID:", sellerId);
        console.log("Order Placement - First Product:", firstProduct?.name);

        // 4. Create the order
        const newOrder = new Order({
            orderId,
            customer: customerId,
            seller: sellerId,
            items: orderItems,
            address,
            payment,
            pricing,
            timeSlot: timeSlot || "now",
            status: "pending",
            expiresAt: new Date(Date.now() + 60000) // 60 seconds from now
        });

        await newOrder.save();

        // 4.1 Auto-decline after 60 seconds if not accepted
        setTimeout(async () => {
            try {
                const order = await Order.findById(newOrder._id);
                if (order && order.status === "pending") {
                    order.status = "cancelled";
                    order.cancelledBy = "system";
                    order.cancelReason = "Seller timeout (60s)";
                    await order.save();

                    // Notify seller about timeout
                    await Notification.create({
                        recipient: sellerId,
                        recipientModel: "Seller",
                        title: "Order Timed Out",
                        message: `Order #${orderId} was cancelled because it wasn't accepted within 60 seconds.`,
                        type: "order",
                        data: { orderId: order._id }
                    });

                    console.log(`Order ${orderId} auto-cancelled due to timeout.`);
                }
            } catch (err) {
                console.error("Auto-cancel error:", err);
            }
        }, 65000); // 65s to give some buffer

        // 5. Create Transaction & Stock History (Simulating immediate sale for demo)
        if (sellerId) {
            // Create pending transaction
            await Transaction.create({
                user: sellerId,
                userModel: "Seller",
                order: newOrder._id,
                type: "Order Payment",
                amount: pricing.total,
                status: "Pending",
                reference: orderId
            });

            // Log stock history for each item
            for (const item of orderItems) {
                await StockHistory.create({
                    product: item.product,
                    seller: sellerId,
                    type: "Sale",
                    quantity: -item.quantity,
                    note: `Order #${orderId}`,
                    order: newOrder._id
                });

                // Deduct actual stock
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }

            // Create notification for seller
            await Notification.create({
                recipient: sellerId,
                recipientModel: "Seller",
                title: "New Order Received!",
                message: `You have received a new order #${orderId} for ₹${pricing.total}.`,
                type: "order",
                data: { orderId: newOrder._id }
            });
        }

        // 6. Clear the customer's cart after order is placed
        await Cart.findOneAndUpdate({ customerId }, { items: [] });

        return handleResponse(res, 201, "Order placed successfully", newOrder);
    } catch (error) {
        console.error("Place Order Error:", error);
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET CUSTOMER ORDERS
================================ */
export const getMyOrders = async (req, res) => {
    try {
        const customerId = req.user.id;
        const orders = await Order.find({ customer: customerId })
            .sort({ createdAt: -1 })
            .populate("items.product");

        return handleResponse(res, 200, "Orders fetched successfully", orders);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET ORDER DETAILS
================================ */
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { id: userId, role } = req.user;

        const order = await Order.findOne({ orderId })
            .populate("customer")
            .populate("items.product")
            .populate("deliveryBoy");

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

        // --- Data Isolation Check ---
        const isOwnerCustomer = role === 'customer' && order.customer._id.toString() === userId;
        const isOwnerSeller = role === 'seller' && order.seller?.toString() === userId;
        const isAssignedDeliveryBoy = role === 'delivery' && order.deliveryBoy?._id.toString() === userId;
        const isAdmin = role === 'admin';

        if (!isOwnerCustomer && !isOwnerSeller && !isAssignedDeliveryBoy && !isAdmin) {
            return handleResponse(res, 403, "Access denied. You are not authorized to view this order.");
        }
        // -----------------------------

        return handleResponse(res, 200, "Order details fetched", order);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   CANCEL ORDER
================================ */
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;
        const customerId = req.user.id;

        const order = await Order.findOne({ orderId, customer: customerId });

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

        if (order.status !== "pending") {
            return handleResponse(res, 400, "Order cannot be cancelled after confirmation");
        }

        order.status = "cancelled";
        order.cancelledBy = "customer";
        order.cancelReason = reason || "Cancelled by user";
        await order.save();

        return handleResponse(res, 200, "Order cancelled successfully", order);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE ORDER STATUS (Admin/Seller/Delivery)
================================ */
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, deliveryBoyId } = req.body;
        const { id: userId, role } = req.user;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

        // --- Data Isolation Check ---
        const isOwnerSeller = role === 'seller' && order.seller?.toString() === userId;
        const isAssignedDeliveryBoy = role === 'delivery' && order.deliveryBoy?.toString() === userId;
        const isAdmin = role === 'admin';

        if (!isOwnerSeller && !isAssignedDeliveryBoy && !isAdmin) {
            return handleResponse(res, 403, "Access denied. You are not authorized to update this order.");
        }
        // -----------------------------

        const oldStatus = order.status;
        if (status) order.status = status;
        if (deliveryBoyId) order.deliveryBoy = deliveryBoyId;

        // Handle Cancellation (Stock Reversal & Transaction Update)
        if (status === 'cancelled' && oldStatus !== 'cancelled') {
            // 1. Reverse Stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });

                await StockHistory.create({
                    product: item.product,
                    seller: order.seller,
                    type: "Correction",
                    quantity: item.quantity,
                    note: `Order #${orderId} Cancelled`,
                    order: order._id
                });
            }

            // 2. Update Transaction
            await Transaction.findOneAndUpdate({ reference: orderId }, { status: 'Failed' });
        }

        // Handle Confirmation/Delivery (Settle Transaction for Demo)
        if (status === 'delivered') {
            await Transaction.findOneAndUpdate(
                { reference: orderId, userModel: "Seller" },
                { status: 'Settled' }
            );

            // Create Delivery Earning Transaction
            if (order.deliveryBoy) {
                const deliveryEarning = Math.round((order.pricing?.total || 0) * 0.1); // 10% for demo
                await Transaction.create({
                    user: order.deliveryBoy,
                    userModel: "Delivery",
                    order: order._id,
                    type: "Delivery Earning",
                    amount: deliveryEarning,
                    status: "Settled",
                    reference: `DEL-${orderId}`
                });
            }
        }

        await order.save();

        if (status === 'confirmed' && role === 'seller') {
            // This order is now 'Automatic' for delivery partners
            console.log("Order confirmed, available for delivery.");
        }

        return handleResponse(res, 200, "Order status updated", order);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET SELLER ORDERS
================================ */
export const getSellerOrders = async (req, res) => {
    try {
        const { id: userId, role } = req.user;

        // If admin, fetch all orders. If seller, fetch only their orders.
        const query = role === 'admin' ? {} : { seller: userId };
        console.log("Fetching Orders - User role:", role, "User ID:", userId);

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate("customer", "name phone")
            .populate("items.product")
            .populate("deliveryBoy")
            .populate("seller", "shopName name");

        console.log("Fetched Orders Count:", orders.length);
        console.log("Latest Order ID:", orders[0]?.orderId, "Status:", orders[0]?.status);

        return handleResponse(res, 200, role === 'admin' ? "All orders fetched" : "Seller orders fetched", orders);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET AVAILABLE ORDERS (Delivery Boy)
================================ */
export const getAvailableOrders = async (req, res) => {
    try {
        const { id: userId, role } = req.user;

        if (role !== 'delivery' && role !== 'admin') {
            return handleResponse(res, 403, "Access denied. Only delivery partners can view available orders.");
        }

        // 1. Get delivery boy's location
        const deliveryPartner = await Delivery.findById(userId);
        if (!deliveryPartner || !deliveryPartner.location || !deliveryPartner.location.coordinates) {
            return handleResponse(res, 200, "Update your location to see nearby orders", []);
        }

        // 2. Find nearby sellers (within 5km)
        let nearbySellers = await Seller.find({
            location: {
                $near: {
                    $geometry: deliveryPartner.location,
                    $maxDistance: 5000 // 5km
                }
            }
        }).select('_id');

        let sellerIds = nearbySellers.map(s => s._id);

        // FALLBACK: If in development/testing and no nearby sellers found, show all available orders
        if (sellerIds.length === 0 && process.env.NODE_ENV !== 'production') {
            console.log(`DEV LOG - Radius search found 0 sellers. Bypassing radius check for Delivery Partner: ${userId}`);
            const allSellers = await Seller.find({}).select('_id');
            sellerIds = allSellers.map(s => s._id);
        }

        // 3. Fetch confirmed/packed orders from these sellers with no delivery boy
        const orders = await Order.find({
            status: { $in: ["confirmed", "packed"] }, // Seller has accepted
            deliveryBoy: null,
            seller: { $in: sellerIds }
        })
            .sort({ createdAt: -1 })
            .populate("customer", "name phone")
            .populate("seller", "shopName address name location");

        console.log(`Delivery Partner (${userId}) - Available orders found: ${orders.length}`);

        return handleResponse(res, 200, orders.length > 0 ? "Available orders fetched" : "No orders found", orders);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   ACCEPT ORDER (Delivery Boy)
================================ */
export const acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { id: userId, role } = req.user;

        if (role !== 'delivery' && role !== 'admin') {
            return handleResponse(res, 403, "Access denied.");
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

        if (order.deliveryBoy) {
            return handleResponse(res, 400, "Order already assigned to another delivery partner");
        }

        order.deliveryBoy = userId;
        // Optionally update status to confirmed if it was pending
        if (order.status === "pending") {
            order.status = "confirmed";
        }

        await order.save();

        // Notify Seller that a partner has been assigned
        await Notification.create({
            recipient: order.seller,
            recipientModel: "Seller",
            title: "Delivery Partner Assigned",
            message: `Delivery partner has been assigned to your order #${orderId}.`,
            type: "order",
            data: { orderId: order._id }
        });

        return handleResponse(res, 200, "Order accepted successfully", order);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
