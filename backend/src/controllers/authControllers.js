import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (userExists) {
        return res
            .status(400)
            .json({ error: "User already exists with this email" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Generate JWT Token
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user email exists in the table
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token for the User
    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token,
        },
    });
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Old and new passwords are required" });
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword }
    });

    res.status(200).json({ status: "success", message: "Password updated successfully" });
};

export { register, login, logout, changePassword };
