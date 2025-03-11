import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

const signupUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName) {
            return res.status(400).json({ error: "Name field is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email field is required." });
        }
        if (!password) {
            return res.status(400).json({ error: "Email field is required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res
            .status(201)
            .json({
                message: "User registered successfully",
                user: { _id: newUser._id, fullName, email, role },
            });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Error Registering User", details: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            
        });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Error in Logging In", details: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Server error in Logging Out", details: error.message });
    }
};

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res
            .status(500)
            .json({ error: "User is not Authenticated.", details: error.message });
    }
};

export { checkAuth, signupUser, logoutUser, loginUser };
