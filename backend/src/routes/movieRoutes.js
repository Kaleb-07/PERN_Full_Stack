import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
    getAllMovies, 
    getMovieById, 
    createMovie, 
    updateMovie, 
    deleteMovie 
} from "../controllers/movieController.js";

const router = express.Router();

// Public routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Protected routes
router.post("/", authMiddleware, createMovie);
router.put("/:id", authMiddleware, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;
