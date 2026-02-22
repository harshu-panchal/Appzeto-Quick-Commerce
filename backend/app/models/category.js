import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
        image: {
            type: String, // Cloudinary URL
        },
        iconId: {
            type: String, // SVG icon identifier
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        type: {
            type: String,
            enum: ["header", "category", "subcategory"],
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for children categories
categorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parentId",
});

export default mongoose.model("Category", categorySchema);
