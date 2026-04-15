/**
 * Admin Middleware
 * Must be used AFTER authMiddleware (req.user must be populated)
 * Blocks access for any user whose role is not ADMIN
 */
export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Not authorized, no user found" });
    }

    if (req.user.role !== "ADMIN") {
        return res
            .status(403)
            .json({ error: "Forbidden: Admin access required" });
    }

    next();
};
