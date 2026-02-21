import express from "express";
import {
    signupCustomer,
    loginCustomer,
    verifyCustomerOTP,
    getCustomerProfile,
    updateCustomerProfile
} from "../controller/customerAuthController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();
router.post("/signup", signupCustomer);
router.post("/login", loginCustomer);
router.post("/verify-otp", verifyCustomerOTP);

// Profile routes
router.get("/profile", verifyToken, getCustomerProfile);
router.put("/profile", verifyToken, updateCustomerProfile);

export default router;
