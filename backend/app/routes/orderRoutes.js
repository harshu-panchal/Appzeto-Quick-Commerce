import express from "express";
import {
    placeOrder,
    getMyOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus,
    getSellerOrders
} from "../controller/orderController.js";
// Assuming there's a middleware to verify customer token
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/place", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/details/:orderId", verifyToken, getOrderDetails);
router.put("/cancel/:orderId", verifyToken, cancelOrder);

// Admin/Seller routes (might need different auth middleware for role checks)
router.get("/seller-orders", verifyToken, getSellerOrders);
router.put("/status/:orderId", verifyToken, updateOrderStatus);

export default router;
