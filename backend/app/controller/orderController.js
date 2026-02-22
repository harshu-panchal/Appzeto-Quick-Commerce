import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
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
            status: "pending"
        });

        await newOrder.save();

        // 4. Clear the customer's cart after order is placed
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
        const order = await Order.findOne({ orderId })
            .populate("customer")
            .populate("items.product")
            .populate("deliveryBoy");

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

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

        const order = await Order.findOne({ orderId });

        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }

        if (status) order.status = status;
        if (deliveryBoyId) order.deliveryBoy = deliveryBoyId;

        await order.save();

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
        const sellerId = req.user.id;
        const orders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .populate("customer", "name phone")
            .populate("items.product");

        return handleResponse(res, 200, "Seller orders fetched successfully", orders);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
