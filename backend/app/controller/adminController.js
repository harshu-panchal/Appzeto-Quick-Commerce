import Admin from "../models/admin.js";
import User from "../models/customer.js";
import Seller from "../models/seller.js";
import Delivery from "../models/delivery.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
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
