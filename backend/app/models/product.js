import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        unit: {
            type: String, // e.g., kg, gm, packet, piece
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        images: [{
            type: String, // Array of Cloudinary URLs
        }],
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        isFeatured: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
