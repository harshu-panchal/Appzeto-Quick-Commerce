import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userType: {
            type: String,
            enum: ["Customer", "Seller", "Rider"],
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["open", "processing", "closed"],
            default: "open",
        },
        messages: [
            {
                sender: {
                    type: String,
                    required: true,
                },
                senderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: 'messages.senderType',
                },
                senderType: {
                    type: String,
                    enum: ["User", "Admin"],
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                isAdmin: {
                    type: Boolean,
                    default: false,
                }
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
