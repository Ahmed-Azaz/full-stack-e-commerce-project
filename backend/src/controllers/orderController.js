import User from "../models/User.js";
import Order from "../models/Order.js";

export const checkout = async (req, res) => {
    try {
        const { paymentMethod, paypalOrderId } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const total = user.cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId: user._id,
            items: user.cart.map((item) => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            total,
            paymentMethod,
            paypalOrderId: paypalOrderId || null,
            status: paymentMethod === "paypal" ? "paid" : "pending"
        });

        // Clear the cart
        user.cart = [];
        await user.save();

        return res.json({
            message: "Order placed successfully",
            order: {
                id: order._id,
                total: order.total,
                status: order.status,
                paymentMethod: order.paymentMethod,
                itemCount: order.items.length,
                createdAt: order.createdAt
            },
            items: user.cart
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
