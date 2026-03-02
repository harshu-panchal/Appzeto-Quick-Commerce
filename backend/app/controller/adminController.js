import mongoose from "mongoose";
import Admin from "../models/admin.js";
import User from "../models/customer.js";
import Seller from "../models/seller.js";
import Delivery from "../models/delivery.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import Transaction from "../models/transaction.js";
import Notification from "../models/notification.js";
import handleResponse from "../utils/helper.js";

/* ===============================
   GET ADMIN DASHBOARD STATS
================================ */
export const getAdminStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const [totalCustomers, totalSellers, totalRiders, totalOrders] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Seller.countDocuments(),
            Delivery.countDocuments(),
            Order.countDocuments(),
        ]);

        const totalUsers = totalCustomers + totalSellers + totalRiders;
        const activeSellers = await Seller.countDocuments({ isVerified: true });

        // 2. Revenue calculation
        const revenueData = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$pricing.total" } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // 3. Revenue History (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const historyAggregation = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: "delivered" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$pricing.total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map aggregation to day names for frontend
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const revenueHistory = historyAggregation.map(item => ({
            name: days[new Date(item._id).getDay()],
            revenue: item.revenue
        }));

        // 4. Recent Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("customer", "name");

        // 5. Category Distribution (Mock logic for now based on orders if products don't have categories)
        // Actually, products DO have categories. Let's aggregate from products or orders.
        const categoryData = await Product.aggregate([
            { $group: { _id: "$headerId", count: { $sum: 1 } } },
            { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
            { $unwind: "$category" },
            { $project: { name: "$category.name", value: "$count" } },
            { $limit: 4 }
        ]);

        // 6. Top Products
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.product", sales: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: "$product" },
            { $project: { name: "$product.name", sales: 1, rev: "$revenue", icon: { $literal: "📦" } } }
        ]);

        return handleResponse(res, 200, "Admin stats fetched successfully", {
            overview: {
                totalUsers,
                activeSellers,
                totalOrders,
                totalRevenue
            },
            revenueHistory,
            recentOrders: recentOrders.map(o => ({
                id: o.orderId,
                customer: o.customer?.name || "Guest",
                statusText: o.status,
                status: o.status === "delivered" ? "success" : o.status === "cancelled" ? "error" : "warning",
                amount: `₹${o.pricing.total}`,
                time: "Recently"
            })),
            categoryData: categoryData.map((c, i) => ({
                ...c,
                color: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"][i % 4]
            })),
            topProducts: topProducts.map(p => ({
                name: p.name,
                sales: p.sales,
                rev: `₹${p.rev.toFixed(2)}`,
                trend: "+5%", // Mock trend for now
                cat: "Product",
                icon: "📦",
                color: "bg-blue-50 text-blue-600"
            }))
        });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET ADMIN PROFILE
================================ */
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return handleResponse(res, 404, "Admin not found");
        }
        return handleResponse(res, 200, "Admin profile fetched successfully", admin);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE ADMIN PROFILE
================================ */
export const updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return handleResponse(res, 404, "Admin not found");
        }

        if (name) admin.name = name;
        if (email) admin.email = email;

        const updatedAdmin = await admin.save();

        return handleResponse(res, 200, "Admin profile updated successfully", updatedAdmin);
    } catch (error) {
        if (error.code === 11000) {
            return handleResponse(res, 400, "Email already in use");
        }
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE ADMIN PASSWORD
================================ */
export const updateAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.user.id).select("+password");
        if (!admin) {
            return handleResponse(res, 404, "Admin not found");
        }

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return handleResponse(res, 401, "Invalid current password");
        }

        admin.password = newPassword;
        await admin.save();

        return handleResponse(res, 200, "Password updated successfully");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY PARTNERS (Admin Only)
================================ */
export const getDeliveryPartners = async (req, res) => {
    try {
        const { status, verified } = req.query;
        let query = {};

        if (status === 'online') {
            query.isOnline = true;
        } else if (status === 'offline') {
            query.isOnline = false;
        }

        if (verified === 'true') {
            query.isVerified = true;
        } else if (verified === 'false') {
            query.isVerified = false;
        }

        const deliveryPartners = await Delivery.find(query).sort({ createdAt: -1 });

        return handleResponse(res, 200, "Delivery partners fetched successfully", deliveryPartners);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   APPROVE DELIVERY PARTNER
================================ */
export const approveDeliveryPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const rider = await Delivery.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        if (!rider) {
            return handleResponse(res, 404, "Rider not found");
        }

        return handleResponse(res, 200, "Rider approved successfully", rider);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   REJECT DELIVERY PARTNER
================================ */
export const rejectDeliveryPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const rider = await Delivery.findByIdAndDelete(id);

        if (!rider) {
            return handleResponse(res, 404, "Rider not found");
        }

        return handleResponse(res, 200, "Rider application rejected and removed");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET ACTIVE FLEET (Admin Only)
================================ */
export const getActiveFleet = async (req, res) => {
    try {
        // Fetch orders that are currently being handled by a delivery partner
        // Statuses: confirmed (if assigned), packed, shipped, out_for_delivery
        const activeOrders = await Order.find({
            deliveryBoy: { $ne: null },
            status: { $in: ["confirmed", "packed", "shipped", "out_for_delivery"] }
        })
            .sort({ updatedAt: -1 })
            .populate("deliveryBoy", "name phone documents vehicleType")
            .populate("seller", "shopName address name")
            .populate("customer", "name phone");

        const fleetData = activeOrders.map(order => ({
            id: order.orderId,
            status: order.status === 'out_for_delivery' ? 'On the Way' :
                order.status === 'packed' ? 'At Pickup' :
                    order.status === 'shipped' ? 'In Transit' : 'Assigned',
            deliveryBoy: {
                name: order.deliveryBoy?.name || "Unknown",
                phone: order.deliveryBoy?.phone || "N/A",
                id: order.deliveryBoy?._id || "N/A",
                vehicle: order.deliveryBoy?.vehicleType || "N/A",
                image: order.deliveryBoy?.documents?.profileImage || "https://via.placeholder.com/200"
            },
            seller: { name: order.seller?.shopName || order.seller?.name || "Unknown" },
            customer: {
                name: order.customer?.name || "Guest",
                phone: order.customer?.phone || "N/A"
            },
            lastUpdate: order.updatedAt
        }));

        return handleResponse(res, 200, "Active fleet fetched successfully", fleetData);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET ADMIN WALLET DATA
================================ */
export const getAdminWalletData = async (req, res) => {
    try {
        // 1. Aggregate Order Data for Earning Stats
        const orderStats = await Order.aggregate([
            { $match: { status: 'delivered' } },
            {
                $group: {
                    _id: null,
                    totalPlatformEarning: { $sum: "$pricing.total" },
                    totalAdminEarning: { $sum: "$pricing.platformFee" }
                }
            }
        ]);

        const stats = orderStats[0] || { totalPlatformEarning: 0, totalAdminEarning: 0 };

        // 2. Aggregate Payout Stats from Transactions
        const payoutStats = await Transaction.aggregate([
            {
                $group: {
                    _id: "$userModel",
                    pendingPayouts: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $in: ["$status", ["Pending", "Processing"]] },
                                        { $gt: ["$amount", 0] } // positive amounts are earnings/payouts owed
                                    ]
                                },
                                "$amount",
                                0
                            ]
                        }
                    },
                    systemFloat: { // Negative amounts from delivery partners (COD)
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$userModel", "Delivery"] },
                                        { $in: ["$status", ["Pending", "Processing"]] },
                                        { $lt: ["$amount", 0] }
                                    ]
                                },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const sellerStats = payoutStats.find(s => s._id === 'Seller') || { pendingPayouts: 0 };
        const deliveryStats = payoutStats.find(s => s._id === 'Delivery') || { pendingPayouts: 0, systemFloat: 0 };

        // 3. Fetch Recent Transactions
        const recentTransactions = await Transaction.find()
            .populate("user", "name shopName")
            .sort({ createdAt: -1 })
            .limit(50);

        return handleResponse(res, 200, "Admin wallet data fetched", {
            stats: {
                totalPlatformEarning: stats.totalPlatformEarning,
                totalAdminEarning: stats.totalAdminEarning,
                sellerPendingPayouts: sellerStats.pendingPayouts,
                deliveryPendingPayouts: deliveryStats.pendingPayouts,
                systemFloat: Math.abs(deliveryStats.systemFloat)
            },
            transactions: recentTransactions.map(t => ({
                id: (t.reference || t._id).toString(),
                type: t.type,
                amount: t.amount,
                status: t.status,
                sender: t.amount < 0 ? (t.user?.name || t.userModel) : "System/Order",
                recipient: t.amount > 0 ? (t.user?.name || t.userModel) : "Platform Wallet",
                date: t.createdAt.toLocaleDateString(),
                time: t.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                notes: t.type
            }))
        });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY TRANSACTIONS (Admin)
================================ */
export const getDeliveryTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userModel: "Delivery" })
            .populate("user", "name phone documents")
            .sort({ createdAt: -1 });

        return handleResponse(res, 200, "Delivery transactions fetched", transactions);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET SELLER WITHDRAWALS (Admin)
================================ */
export const getSellerWithdrawals = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userModel: "Seller",
            type: "Withdrawal"
        }).populate("user", "name shopName phone");

        return handleResponse(res, 200, "Seller withdrawals fetched", transactions);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET SELLER TRANSACTIONS (Admin)
================================ */
export const getSellerTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userModel: "Seller" })
            .populate("user", "name shopName phone bankDetails")
            .populate({
                path: "order",
                select: "orderId pricing",
                populate: {
                    path: "items.product",
                    select: "name"
                }
            })
            .sort({ createdAt: -1 });

        return handleResponse(res, 200, "Seller transactions fetched", transactions);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY WITHDRAWALS (Admin)
================================ */
export const getDeliveryWithdrawals = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userModel: "Delivery",
            type: "Withdrawal"
        }).populate("user", "name phone");

        return handleResponse(res, 200, "Delivery withdrawals fetched", transactions);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE WITHDRAWAL STATUS (Admin)
================================ */
export const updateWithdrawalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        if (!['Settled', 'Failed', 'Processing'].includes(status)) {
            return handleResponse(res, 400, "Invalid status");
        }

        const transaction = await Transaction.findById(id).populate("user", "name");
        if (!transaction) {
            return handleResponse(res, 404, "Transaction not found");
        }

        transaction.status = status;
        if (reason) transaction.notes = reason;
        await transaction.save();

        return handleResponse(res, 200, `Withdrawal ${status} successfully`);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   SETTLE TRANSACTION (Admin)
================================ */
export const settleTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { status: "Settled" },
            { new: true }
        ).populate("user", "name");

        if (!transaction) {
            return handleResponse(res, 404, "Transaction not found");
        }

        // Notify Rider
        await Notification.create({
            recipient: transaction.user._id,
            recipientModel: "Delivery",
            title: "Payment Settled",
            message: `Your payment of ₹${transaction.amount} has been settled.`,
            type: "payment",
            data: { transactionId: transaction._id }
        });

        return handleResponse(res, 200, "Transaction settled successfully", transaction);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   BULK SETTLE DELIVERY (Admin)
================================ */
export const bulkSettleDelivery = async (req, res) => {
    try {
        const result = await Transaction.updateMany(
            { userModel: "Delivery", status: "Pending" },
            { status: "Settled" }
        );

        return handleResponse(res, 200, `${result.modifiedCount} transactions settled successfully`);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY CASH BALANCES (Admin)
================================ */

export const getDeliveryCashBalances = async (req, res) => {
    try {
        const riders = await Delivery.aggregate([
            // 1. Join Transactions (Cash Collection & Settlement)
            {
                $lookup: {
                    from: "transactions",
                    localField: "_id",
                    foreignField: "user",
                    as: "allTransactions"
                }
            },
            // 2. Join Orders for counts
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "deliveryBoy",
                    as: "allOrders"
                }
            },
            {
                $project: {
                    name: 1,
                    phone: 1,
                    avatar: 1,
                    limit: { $ifNull: ["$limit", 5000] },
                    documents: 1,
                    // Filter Cash Transactions & Calculate currentCash
                    currentCash: {
                        $reduce: {
                            input: {
                                $filter: {
                                    input: "$allTransactions",
                                    as: "t",
                                    cond: { $in: ["$$t.type", ["Cash Collection", "Cash Settlement"]] }
                                }
                            },
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $eq: ["$$this.type", "Cash Collection"] },
                                    { $add: ["$$value", "$$this.amount"] },
                                    { $subtract: ["$$value", { $abs: "$$this.amount" }] }
                                ]
                            }
                        }
                    },
                    // Count Pending COD Orders (confirmed etc)
                    pendingOrders: {
                        $size: {
                            $filter: {
                                input: "$allOrders",
                                as: "o",
                                cond: {
                                    $and: [
                                        { $in: ["$$o.status", ["confirmed", "packed", "picked_up", "out_for_delivery"]] },
                                        { $in: ["$$o.payment.method", ["cash", "cod"]] }
                                    ]
                                }
                            }
                        }
                    },
                    // Count Total Delivered Orders
                    totalOrders: {
                        $size: {
                            $filter: {
                                input: "$allOrders",
                                as: "o",
                                cond: { $eq: ["$$o.status", "delivered"] }
                            }
                        }
                    },
                    // Last Settlement Date
                    lastSettlementTxn: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: {
                                        $filter: {
                                            input: "$allTransactions",
                                            as: "t",
                                            cond: { $eq: ["$$t.type", "Cash Settlement"] }
                                        }
                                    },
                                    sortBy: { createdAt: -1 }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    phone: 1,
                    avatar: {
                        $cond: [
                            { $ifNull: ["$documents.profileImage", false] },
                            "$documents.profileImage",
                            { $concat: ["https://api.dicebear.com/7.x/avataaars/svg?seed=", "$name"] }
                        ]
                    },
                    currentCash: 1,
                    limit: 1,
                    status: {
                        $cond: [
                            { $gt: ["$currentCash", 4500] }, "critical",
                            { $cond: [{ $gt: ["$currentCash", 3000] }, "warning", "safe"] }
                        ]
                    },
                    pendingOrders: 1,
                    totalOrders: 1,
                    lastSettlement: { $ifNull: ["$lastSettlementTxn.createdAt", "Never"] }
                }
            }
        ]);

        const totalInHand = riders.reduce((acc, r) => acc + r.currentCash, 0);
        const overLimitCount = riders.filter(r => r.currentCash >= r.limit).length;

        return handleResponse(res, 200, "Cash balances fetched", {
            riders,
            stats: {
                totalInHand,
                overLimitCount,
                avgBalance: riders.length ? totalInHand / riders.length : 0
            }
        });
    } catch (error) {
        console.error("Aggregation Error:", error);
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   SETTLE RIDER CASH (Admin)
================================ */
export const settleRiderCash = async (req, res) => {
    try {
        const { riderId, amount, method } = req.body;

        if (!riderId || !amount || amount <= 0) {
            return handleResponse(res, 400, "Missing riderId or invalid amount");
        }

        const rider = await Delivery.findById(riderId);
        if (!rider) return handleResponse(res, 404, "Rider not found");

        const settlement = await Transaction.create({
            user: riderId,
            userModel: "Delivery",
            type: "Cash Settlement",
            amount: -Math.abs(amount),
            status: "Settled",
            reference: `CSH-SET-${Date.now()}`,
            notes: `Method: ${method || 'Cash'}`
        });

        // Notify Rider
        await Notification.create({
            recipient: riderId,
            recipientModel: "Delivery",
            title: "Cash Settled",
            message: `Admin has collected ₹${amount} cash from you. Your balance is updated.`,
            type: "payment",
            data: { transactionId: settlement._id }
        });
        return handleResponse(res, 201, "Cash settled successfully", settlement);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET RIDER CASH DETAILS (Admin)
================================ */
export const getRiderCashDetails = async (req, res) => {
    try {
        const { id: riderId } = req.params;
        const transactions = await Transaction.find({
            user: riderId,
            userModel: 'Delivery',
            type: 'Cash Collection'
        })
            .populate('order', 'orderId pricing createdAt')
            .sort({ createdAt: -1 })
            .limit(20);

        const formatted = transactions.map(t => ({
            id: t.order?.orderId || t.reference || 'N/A',
            amount: t.amount,
            time: new Date(t.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            date: t.createdAt
        }));

        return handleResponse(res, 200, "Rider cash details fetched", formatted);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET CASH SETTLEMENT HISTORY (Admin)
================================ */
export const getCashSettlementHistory = async (req, res) => {
    try {
        const history = await Transaction.find({
            userModel: "Delivery",
            type: "Cash Settlement"
        })
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .limit(100);

        const mappedHistory = history.map(h => ({
            id: (h.reference || h._id).toString(),
            rider: h.user?.name || "Unknown Rider",
            amount: Math.abs(h.amount),
            date: h.createdAt,
            method: h.notes?.replace('Method: ', '') || "Cash Submission",
            status: "completed"
        }));

        return handleResponse(res, 200, "Settlement history fetched", mappedHistory);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET ALL CUSTOMERS (Admin)
================================ */
export const getUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            { $match: { role: "user" } },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "customer",
                    as: "userOrders"
                }
            },
            {
                $project: {
                    id: { $toString: "$_id" },
                    name: { $ifNull: ["$name", "Unnamed Customer"] },
                    email: 1,
                    phone: 1,
                    joinedDate: "$createdAt",
                    status: { $cond: [{ $eq: ["$isActive", false] }, "inactive", "active"] },
                    totalOrders: { $size: "$userOrders" },
                    totalSpent: { $sum: "$userOrders.pricing.total" },
                    lastOrderDate: { $max: "$userOrders.createdAt" },
                    avatar: { $concat: ["https://api.dicebear.com/7.x/avataaars/svg?seed=", { $ifNull: ["$name", "Customer"] }] }
                }
            },
            { $sort: { totalOrders: -1 } }
        ]);

        return handleResponse(res, 200, "Users fetched successfully", users);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET USER BY ID (Admin)
================================ */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id), role: "user" } },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "customer",
                    as: "userOrders"
                }
            },
            {
                $project: {
                    id: { $toString: "$_id" },
                    name: { $ifNull: ["$name", "Unnamed Customer"] },
                    email: 1,
                    phone: 1,
                    joinedDate: "$createdAt",
                    status: { $cond: [{ $eq: ["$isActive", false] }, "inactive", "active"] },
                    totalOrders: { $size: "$userOrders" },
                    totalSpent: { $sum: "$userOrders.pricing.total" },
                    lastOrderDate: { $max: "$userOrders.createdAt" },
                    avatar: { $concat: ["https://api.dicebear.com/7.x/avataaars/svg?seed=", { $ifNull: ["$name", "Customer"] }] },
                    addresses: { $ifNull: ["$addresses", []] }
                }
            }
        ]);

        if (!user || user.length === 0) {
            return handleResponse(res, 404, "Customer not found");
        }

        // Fetch recent orders for the timeline
        const recentOrders = await Order.find({ customer: id })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("items.product", "name mainImage");

        const responseData = {
            ...user[0],
            recentOrders: recentOrders.map(o => ({
                id: o.orderId,
                _id: o._id,
                itemsCount: o.items.length,
                amount: o.pricing.total,
                date: o.createdAt,
                status: o.status
            }))
        };

        return handleResponse(res, 200, "Customer details fetched successfully", responseData);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
