import User from "../models/User.js";

const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    cart: user.cart,
    favorites: user.favorites,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

const findSnapshotIndex = (arr, productId) =>
    arr.findIndex((item) => item.productId === Number(productId));

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({ user: safeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (typeof avatar === "string") user.avatar = avatar;

        await user.save();
        return res.json({ user: safeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        return res.json({ items: user?.cart || [] });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, title, price, image, rating, description, quantity = 1 } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const index = findSnapshotIndex(user.cart, productId);

        if (index >= 0) {
            user.cart[index].quantity += Number(quantity);
        } else {
            user.cart.push({
                productId: Number(productId),
                title,
                price,
                image,
                rating,
                description,
                quantity: Number(quantity)
            });
        }

        await user.save();
        return res.json({ items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const index = findSnapshotIndex(user.cart, productId);
        if (index === -1) return res.status(404).json({ message: "Cart item not found" });

        const qty = Number(quantity);
        if (qty <= 0) {
            user.cart.splice(index, 1);
        } else {
            user.cart[index].quantity = qty;
        }

        await user.save();
        return res.json({ items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = user.cart.filter((item) => item.productId !== Number(productId));
        await user.save();

        return res.json({ items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        return res.json({ items: user?.favorites || [] });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const { productId, title, price, image, rating, description } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const exists = user.favorites.some((item) => item.productId === Number(productId));
        if (!exists) {
            user.favorites.push({
                productId: Number(productId),
                title,
                price,
                image,
                rating,
                description,
                quantity: 1
            });
            await user.save();
        }

        return res.json({ items: user.favorites });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.favorites = user.favorites.filter((item) => item.productId !== Number(productId));
        await user.save();

        return res.json({ items: user.favorites });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};