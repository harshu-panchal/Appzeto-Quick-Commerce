import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
} from "../controller/productController.js";
import { verifyToken, allowRoles } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public/App route to get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Admin/Seller protected routes
router.post(
    "/",
    verifyToken,
    allowRoles("admin", "seller"),
    upload.array('images', 5), // Allow up to 5 images
    createProduct
);

router.put(
    "/:id",
    verifyToken,
    allowRoles("admin", "seller"),
    upload.array('images', 5),
    updateProduct
);

router.delete(
    "/:id",
    verifyToken,
    allowRoles("admin", "seller"),
    deleteProduct
);

export default router;
