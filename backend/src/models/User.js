import mongoose from "mongoose";

const productSnapshotSchema = new mongoose.Schema(
    {
        productId: { type: Number, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
        rating: { type: Number, default: 0 },
        description: { type: String, default: "" },
        quantity: { type: Number, default: 1 }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, default: null },
        avatar: { type: String, default: "" },
        authProvider: { type: String, enum: ["local", "google"], default: "local" },
        googleId: { type: String, default: "" },
        cart: { type: [productSnapshotSchema], default: [] },
        favorites: { type: [productSnapshotSchema], default: [] }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);