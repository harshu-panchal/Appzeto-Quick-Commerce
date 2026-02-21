import express from "express";
import { signupSeller, loginSeller } from "../controller/sellerAuthController.js";
import { verifyToken, allowRoles } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signupSeller);
router.post("/login", loginSeller);

// Protected seller route example
router.get(
    "/profile",
    verifyToken,
    allowRoles("seller"),
    (req, res) => {
        res.json({
            success: true,
            message: "Seller profile access granted",
        });
    }
);

export default router;
