import express from "express";
import {
    signupAdmin,
    loginAdmin,
} from "../controller/adminAuthController.js";
import {
    getAdminProfile,
    updateAdminProfile,
    updateAdminPassword,
    getAdminStats,
} from "../controller/adminController.js";

import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupAdmin);     // normally internal
router.post("/login", loginAdmin);

// Profile routes
router.get(
    "/profile",
    verifyToken,
    allowRoles("admin"),
    getAdminProfile
);

router.put(
    "/profile",
    verifyToken,
    allowRoles("admin"),
    updateAdminProfile
);

router.put(
    "/profile/password",
    verifyToken,
    allowRoles("admin"),
    updateAdminPassword
);

router.get(
    "/stats",
    verifyToken,
    allowRoles("admin"),
    getAdminStats
);

// Protected admin route example
router.get(
    "/dashboard",
    verifyToken,
    allowRoles("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Admin Dashboard",
        });
    }
);

export default router;