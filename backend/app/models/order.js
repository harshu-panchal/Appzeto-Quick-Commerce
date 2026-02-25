import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            // In a multi-seller cart, this would be complex. 
            // For now, let's assume we store the primary seller or track per item.
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                variantSlot: String, // To identify which variant was bought
                image: String,
            },
        ],
        address: {
            type: {
                type: String,
                enum: ["Home", "Work", "Other"],
                default: "Home",
            },
            name: String,
            address: String,
            city: String,
            phone: String,
            landmark: String,
        },
        payment: {
            method: {
                type: String,
                enum: ["cash", "online", "wallet"],
                default: "cash",
            },
            status: {
                type: String,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending",
            },
            transactionId: String,
        },
        pricing: {
            subtotal: Number,
            deliveryFee: Number,
            platformFee: Number,
            gst: Number,
            tip: {
                type: Number,
                default: 0,
            },
            discount: {
                type: Number,
                default: 0,
            },
            total: Number,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"],
            default: "pending",
        },
        timeSlot: {
            type: String,
            default: "now",
        },
        deliveryBoy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Delivery",
        },
        cancelledBy: {
            type: String,
            enum: ["customer", "seller", "admin", "system"],
        },
        cancelReason: String,
        deviceType: {
            type: String,
            enum: ["Mobile", "Desktop", "Tablet"],
            default: "Mobile",
        },
        trafficSource: {
            type: String,
            enum: ["Direct", "Search", "Social", "Referral"],
            default: "Direct",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
