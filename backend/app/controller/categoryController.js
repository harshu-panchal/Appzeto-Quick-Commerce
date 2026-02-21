import Category from "../models/category.js";
import handleResponse from "../utils/helper.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/* ===============================
   GET CATEGORIES (Hierarchy)
================================ */
export const getCategories = async (req, res) => {
    try {
        const { flat, status } = req.query;

        // Base query for categories
        const query = {};
        if (status) query.status = status;

        if (flat === 'true') {
            const categories = await Category.find({ ...query, type: { $in: ['header', 'category'] } })
                .select('name type parentId status');
            return handleResponse(res, 200, "Flat categories fetched", categories);
        }

        // Fetch headers and populate the full tree (Header -> Category -> Subcategory)
        // We filter children based on the same status if provided
        const populateOptions = {
            path: "children",
        };

        if (status) {
            populateOptions.match = { status: status };
            populateOptions.populate = {
                path: "children",
                match: { status: status }
            };
        } else {
            populateOptions.populate = {
                path: "children"
            };
        }

        const categories = await Category.find({ ...query, type: "header" })
            .populate(populateOptions);

        return handleResponse(res, 200, "Categories fetched successfully", categories);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   CREATE CATEGORY / SUBCATEGORY
================================ */
export const createCategory = async (req, res) => {
    try {
        const { name, slug, description, type, parentId, status } = req.body;

        if (!name || !slug || !type) {
            return handleResponse(res, 400, "Name, slug and type are required");
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        const category = await Category.create({
            name,
            slug,
            description,
            type,
            parentId: parentId || null,
            status: status || "active",
            image: imageUrl
        });

        return handleResponse(res, 201, "Category created successfully", category);
    } catch (error) {
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
        const { name, slug, description, status, type, parentId } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return handleResponse(res, 404, "Category not found");
        }

        if (name) category.name = name;
        if (slug) category.slug = slug;
        if (description !== undefined) category.description = description;
        if (status) category.status = status;
        if (type) category.type = type;
        if (parentId !== undefined) category.parentId = parentId || null;

        if (req.file) {
            category.image = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        await category.save();

        return handleResponse(res, 200, "Category updated successfully", category);
    } catch (error) {
        if (error.code === 11000) {
            return handleResponse(res, 400, "Slug already exists");
        }
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   DELETE CATEGORY (Cascading)
================================ */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete all descendants recursively
        const getAllDescendantIds = async (parentId) => {
            const children = await Category.find({ parentId });
            let ids = [parentId];
            for (const child of children) {
                const descendantIds = await getAllDescendantIds(child._id);
                ids = [...ids, ...descendantIds];
            }
            return ids;
        };

        const idsToDelete = await getAllDescendantIds(id);
        await Category.deleteMany({ _id: { $in: idsToDelete } });

        return handleResponse(res, 200, "Category and its sub-categories deleted successfully");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
