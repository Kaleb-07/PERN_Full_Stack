import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
    addReview, 
    getMovieReviews, 
    deleteReview 
} from "../controllers/reviewController.js";

const router = express.Router();

// The Public View reviews for a movie
router.get("/movie/:movieId", getMovieReviews);

// The Protected:- Post/Delete reviews
router.post("/", authMiddleware, addReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
