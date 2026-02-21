import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
        },

        vehicleType: {
            type: String,
            enum: ["bike", "cycle", "scooter"],
            default: "bike",
        },

        vehicleNumber: {
            type: String,
            trim: true,
        },

        currentArea: {
            type: String,
            trim: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },



        isOnline: {
            type: Boolean,
            default: true,
        },

        role: {
            type: String,
            default: "delivery",
        },
        lastLogin: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

deliverySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export default mongoose.model("Delivery", deliverySchema);