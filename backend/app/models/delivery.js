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
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },
        role: {
            type: String,
            default: "delivery",
        },

        otp: {
            type: String,
            select: false,
        },

        otpExpiry: {
            type: Date,
            select: false,
        },

        lastLogin: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

deliverySchema.index({ location: "2dsphere" });

deliverySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export default mongoose.model("Delivery", deliverySchema);