import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controller/categoryController.js";
import { verifyToken, allowRoles } from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get all categories (Hierarchy)
router.get("/", getCategories);

// Create Category
router.post(
    "/",
    verifyToken,
    allowRoles("admin"),
    upload.single('image'),
    createCategory
);

// Update Category
router.put(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    upload.single('image'),
    updateCategory
);

// Delete Category
router.delete(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    deleteCategory
);

export default router;
