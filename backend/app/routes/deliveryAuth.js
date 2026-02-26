import express from "express";
import {
    signupDelivery,
    loginDelivery,
    verifyDeliveryOTP,
    getDeliveryProfile,
    updateDeliveryProfile
} from "../controller/deliveryAuthController.js";
import { getDeliveryStats, getDeliveryEarnings, getMyDeliveryOrders } from "../controller/deliveryController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/send-signup-otp", upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "dl", maxCount: 1 }
]), signupDelivery);
router.post("/send-login-otp", loginDelivery);
router.post("/verify-otp", verifyDeliveryOTP);

// Profile routes
router.get("/profile", verifyToken, getDeliveryProfile);
router.put("/profile", verifyToken, updateDeliveryProfile);
router.get("/stats", verifyToken, getDeliveryStats);
router.get("/earnings", verifyToken, getDeliveryEarnings);
router.get("/order-history", verifyToken, getMyDeliveryOrders);

export default router;