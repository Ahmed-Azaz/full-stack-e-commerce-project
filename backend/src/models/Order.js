import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: Number, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
        quantity: { type: Number, default: 1 }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [orderItemSchema], required: true },
        total: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["cash", "paypal"], required: true },
        paypalOrderId: { type: String, default: null },
        status: { type: String, enum: ["pending", "paid", "delivered"], default: "pending" }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
