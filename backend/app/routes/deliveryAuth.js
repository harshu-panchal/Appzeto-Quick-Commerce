import express from "express";
import {
    signupDelivery,
    loginDelivery,
    verifyDeliveryOTP,
    getDeliveryProfile,
    updateDeliveryProfile
} from "../controller/deliveryAuthController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupDelivery);
router.post("/login", loginDelivery);
router.post("/verify-otp", verifyDeliveryOTP);

// Profile routes
router.get("/profile", verifyToken, getDeliveryProfile);
router.put("/profile", verifyToken, updateDeliveryProfile);

export default router;