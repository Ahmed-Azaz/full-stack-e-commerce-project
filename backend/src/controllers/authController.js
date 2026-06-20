import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

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

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash,
            authProvider: "local"
        });

        return res.status(201).json({
            user: safeUser(user),
            token: createToken(user._id)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.authProvider === "google" && !user.passwordHash) {
            return res.status(401).json({ message: "Use Google login for this account" });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.json({
            user: safeUser(user),
            token: createToken(user._id)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture || "",
                googleId,
                authProvider: "google"
            });
        } else {
            user.googleId = googleId;
            user.authProvider = user.authProvider || "google";
            if (!user.avatar) user.avatar = picture || "";
            if (!user.name) user.name = name;
            await user.save();
        }

        return res.json({
            user: safeUser(user),
            token: createToken(user._id)
        });
    } catch (error) {
        return res.status(401).json({ message: "Google sign-in failed" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user: safeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};