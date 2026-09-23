import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const ensureDatabase = (res) => {
    if (mongoose.connection.readyState === 1) return true;

    res.status(503).json({
        success: false,
        message: "Authentication service is temporarily unavailable"
    });
    return false;
};

const register = async (req, res) => {
    try {
        if (!ensureDatabase(res)) return;
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields required" });

        const existing = await userModel.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashed });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, data: { token, user: { name: user.name, email: user.email } } });
    } catch (error) {
        console.error("Auth controller error:", error?.message || error);
        if (mongoose.connection.readyState !== 1 || error?.message?.includes('buffering timed out')) {
            return res.status(503).json({
                success: false,
                message: "Authentication service is temporarily unavailable"
            });
        }
        const message = process.env.NODE_ENV === 'production' ? 'Server error' : (error?.message || 'Server error');
        res.status(500).json({ success: false, message });
    }
}

const login = async (req, res) => {
    try {
        if (!ensureDatabase(res)) return;
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "All fields required" });

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, data: { token, user: { name: user.name, email: user.email } } });
    } catch (error) {
        console.log(error);
        if (mongoose.connection.readyState !== 1 || error?.message?.includes('buffering timed out')) {
            return res.status(503).json({
                success: false,
                message: "Authentication service is temporarily unavailable"
            });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export { register, login };
