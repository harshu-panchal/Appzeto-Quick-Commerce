import Product from "../models/product.js";
import handleResponse from "../utils/helper.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { slugify } from "../utils/slugify.js";

/* ===============================
   GET PRODUCTS (With Filters)
================================ */
export const getProducts = async (req, res) => {
    try {
        const { search, category, status, featured } = req.query;

        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (category) {
            query.categoryId = category;
        }

        if (status) {
            query.status = status;
        }
        if (featured !== undefined) {
            query.isFeatured = featured === 'true';
        }

        const products = await Product.find(query)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name')
            .sort({ createdAt: -1 });

        return handleResponse(res, 200, "Products fetched successfully", products);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   CREATE PRODUCT
================================ */
export const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };

        // Generate slug if not provided or clean it
        if (!productData.slug || productData.slug.trim() === "") {
            productData.slug = slugify(productData.name);
        } else {
            productData.slug = slugify(productData.slug);
        }

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                uploadToCloudinary(file.buffer, 'products')
            );
            productData.images = await Promise.all(uploadPromises);
        }

        const product = await Product.create(productData);
        return handleResponse(res, 201, "Product created successfully", product);
    } catch (error) {
        if (error.code === 11000) {
            return handleResponse(res, 400, "Product slug already exists");
        }
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE PRODUCT
================================ */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = { ...req.body };

        if (productData.name && (!productData.slug || productData.slug.trim() === "")) {
            productData.slug = slugify(productData.name);
        } else if (productData.slug) {
            productData.slug = slugify(productData.slug);
        }

        const product = await Product.findById(id);
        if (!product) {
            return handleResponse(res, 404, "Product not found");
        }

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                uploadToCloudinary(file.buffer, 'products')
            );
            const newImages = await Promise.all(uploadPromises);
            // Optional: Keep old images or replace them. Here we replace.
            productData.images = newImages;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: productData },
            { new: true, runValidators: true }
        );

        return handleResponse(res, 200, "Product updated successfully", updatedProduct);
    } catch (error) {
        if (error.code === 11000) {
            return handleResponse(res, 400, "Product slug already exists");
        }
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   DELETE PRODUCT
================================ */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return handleResponse(res, 404, "Product not found");
        }

        return handleResponse(res, 200, "Product deleted successfully");
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   GET SINGLE PRODUCT
================================ */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name');

        if (!product) {
            return handleResponse(res, 404, "Product not found");
        }

        return handleResponse(res, 200, "Product details fetched", product);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};
