import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
    addReview, 
    getMovieReviews, 
    deleteReview 
} from "../controllers/reviewController.js";

const router = express.Router();

// Public: View reviews for a movie
router.get("/movie/:movieId", getMovieReviews);

// Protected: Post/Delete reviews
router.post("/", authMiddleware, addReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
