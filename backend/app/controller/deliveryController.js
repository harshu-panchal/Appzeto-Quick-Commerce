import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
import handleResponse from "../utils/helper.js";
import mongoose from "mongoose";

/* ===============================
   GET DELIVERY DASHBOARD STATS
================================ */
export const getDeliveryStats = async (req, res) => {
    try {
        const deliveryBoyId = req.user.id;

        const orders = await Order.find({ deliveryBoy: deliveryBoyId, status: 'delivered' });
        const totalDeliveries = orders.length;

        // Today's earnings
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTransactions = await Transaction.find({
            user: deliveryBoyId,
            userModel: 'Delivery',
            createdAt: { $gte: today },
            status: 'Settled'
        });

        const todayEarnings = todayTransactions.reduce((acc, t) => acc + t.amount, 0);

        return handleResponse(res, 200, "Stats fetched", {
            todayEarnings,
            totalDeliveries,
            incentives: 0, // Mock for now
            cashCollected: 0 // Mock for now
        });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY EARNINGS
================================ */
export const getDeliveryEarnings = async (req, res) => {
    try {
        const deliveryBoyId = req.user.id;

        const transactions = await Transaction.find({ user: deliveryBoyId, userModel: 'Delivery' })
            .sort({ createdAt: -1 })
            .populate("order", "orderId pricing");

        const totalEarnings = transactions
            .filter(t => t.status === 'Settled')
            .reduce((acc, t) => acc + t.amount, 0);

        const onlinePay = transactions
            .filter(t => t.type === 'Delivery Earning')
            .reduce((acc, t) => acc + t.amount, 0); // Logic for online/cash split can be added

        // Last 7 days aggregation for chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyAggregation = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(deliveryBoyId),
                    userModel: 'Delivery',
                    status: 'Settled',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    earnings: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format for Recharts
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const foundAt = dailyAggregation.find(a => a._id === dateStr);
            chartData.push({
                name: dayNames[d.getDay()],
                earnings: foundAt ? foundAt.earnings : 0,
                incentives: 0
            });
        }

        return handleResponse(res, 200, "Earnings fetched", {
            totalEarnings,
            incentives: 0,
            bonuses: 0,
            onlinePay,
            cashCollected: 0,
            chartData,
            recentTransactions: transactions.slice(0, 10).map(t => ({
                id: (t._id).toString().slice(-6).toUpperCase(),
                date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                amount: t.amount,
                status: t.status,
                type: t.type
            }))
        });
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET DELIVERY ORDER HISTORY
================================ */
export const getMyDeliveryOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.user.id;
        const { status } = req.query;

        let query = { deliveryBoy: deliveryBoyId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate("seller", "shopName address")
            .populate("customer", "name phone");

        return handleResponse(res, 200, "Delivery orders fetched", orders);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
