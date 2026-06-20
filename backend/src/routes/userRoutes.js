import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    addFavorite,
    addToCart,
    getCart,
    getFavorites,
    getProfile,
    removeCartItem,
    removeFavorite,
    updateCartItem,
    updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.patch("/cart/:productId", protect, updateCartItem);
router.delete("/cart/:productId", protect, removeCartItem);

router.get("/favorites", protect, getFavorites);
router.post("/favorites", protect, addFavorite);
router.delete("/favorites/:productId", protect, removeFavorite);

export default router;