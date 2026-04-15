import express from "express";
import {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    getMyWatchlist,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

// Get my watchlist
router.get("/", getMyWatchlist);

// adding API
router.post("/", addToWatchlist);
router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

// {{baseUrl}}/watchlist/:id
router.put("/:id", updateWatchlistItem);

// {{baseUrl}}/watchlist/:id
router.delete("/:id", removeFromWatchlist);

export default router;
