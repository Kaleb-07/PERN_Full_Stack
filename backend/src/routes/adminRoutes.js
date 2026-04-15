import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
    getStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminMovies,
    createAdminMovie,
    deleteAdminMovie,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes below require: valid JWT + ADMIN role
router.use(authMiddleware, adminMiddleware);

// Platform statistics
router.get("/stats", getStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Movie management (admin-scoped, bypasses ownership checks)
router.get("/movies", getAdminMovies);
router.post("/movies", createAdminMovie);
router.delete("/movies/:id", deleteAdminMovie);

export default router;
