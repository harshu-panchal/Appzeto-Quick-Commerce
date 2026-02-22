import Category from "../models/category.js";
import handleResponse from "../utils/helper.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/* ===============================
   GET ALL CATEGORIES (Hierarchy)
================================ */
export const getCategories = async (req, res) => {
    try {
        const { flat, tree } = req.query;

        // If tree structure is requested (for hierarchy explorer)
        if (tree === 'true') {
            const categories = await Category.find({ type: "header" })
                .populate({
                    path: "children",
                    populate: {
                        path: "children"
                    }
                })
                .sort({ name: 1 });
            return handleResponse(res, 200, "Category tree fetched", categories);
        }

        // Default or explicit flat: return all categories for table views
        const categories = await Category.find().sort({ name: 1 });
        return handleResponse(res, 200, "Categories fetched successfully", categories);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   CREATE CATEGORY
================================ */
export const createCategory = async (req, res) => {
    try {
        const categoryData = { ...req.body };

        if (req.file) {
            categoryData.image = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        if (categoryData.parentId === "" || categoryData.parentId === "null" || !categoryData.parentId) {
            categoryData.parentId = null;
        }

        const category = await Category.create(categoryData);
        return handleResponse(res, 201, "Category created successfully", category);
    } catch (error) {
        console.error("Create Category Error:", error);
        if (error.code === 11000) {
            return handleResponse(res, 400, "Slug already exists");
        }
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE CATEGORY
================================ */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = { ...req.body };

        if (req.file) {
            categoryData.image = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        if (categoryData.parentId === "" || categoryData.parentId === "null" || !categoryData.parentId) {
            categoryData.parentId = null;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: categoryData },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return handleResponse(res, 404, "Category not found");
        }

        return handleResponse(res, 200, "Category updated successfully", updatedCategory);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   DELETE CATEGORY
================================ */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find all descendants recursively might be complex with simple parentId
        // For simplicity, we delete the item. User mentioned "Destroy linked" in frontend.
        // A more robust implementation would delete children too.

        const deleteWithChildren = async (parentId) => {
            const children = await Category.find({ parentId });
            for (const child of children) {
                await deleteWithChildren(child._id);
            }
            await Category.findByIdAndDelete(parentId);
        };

        await deleteWithChildren(id);

        return handleResponse(res, 200, "Category and all descendants deleted");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
