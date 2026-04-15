import { prisma } from "../config/db.js";

/** POST /api/reviews */
const addReview = async (req, res) => {
    const { movieId, rating, comment } = req.body;

    if (!movieId || !rating) {
        return res.status(400).json({ error: "Movie ID and rating are required" });
    }

    if (rating < 1 || rating > 10) {
        return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }

    try {
        // Check if user already reviewed this movie
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId: req.user.id,
                    movieId: movieId
                }
            }
        });

        if (existingReview) {
            // Update existing review
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment }
            });
            return res.status(200).json({ status: "success", data: { review: updatedReview } });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId: req.user.id,
                movieId: movieId
            },
            include: {
                user: { select: { name: true } }
            }
        });

        res.status(201).json({ status: "success", data: { review } });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Failed to add review" });
    }
};

/** GET /api/reviews/movie/:movieId */
const getMovieReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { movieId: req.params.movieId },
            include: {
                user: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json({ status: "success", data: { reviews } });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

/** DELETE /api/reviews/:id */
const deleteReview = async (req, res) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: req.params.id }
        });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Only author or admin can delete
        if (review.userId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        await prisma.review.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ status: "success", message: "Review deleted" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Failed to delete review" });
    }
};

export { addReview, getMovieReviews, deleteReview };
