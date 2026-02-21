import express from "express";
import {
    signupAdmin,
    loginAdmin,
} from "../controller/adminAuthController.js";

import { verifyToken, allowRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signupAdmin);     // normally internal
router.post("/login", loginAdmin);

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