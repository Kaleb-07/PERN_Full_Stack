import express from "express";
import { register, login, logout, changePassword, updateProfile } from "../controllers/authControllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/change-password", authMiddleware, changePassword);
router.put("/profile", authMiddleware, updateProfile);


export default router;
