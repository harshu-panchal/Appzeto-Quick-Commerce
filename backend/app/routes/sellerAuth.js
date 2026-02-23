import express from "express";
import { signupSeller, loginSeller } from "../controller/sellerAuthController.js";
import { getSellerProfile, updateSellerProfile } from "../controller/sellerController.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupSeller);
router.post("/login", loginSeller);

// Profile routes
router.get(
    "/profile",
    verifyToken,
    allowRoles("seller"),
    getSellerProfile
);

router.put(
    "/profile",
    verifyToken,
    allowRoles("seller"),
    updateSellerProfile
);

export default router;
