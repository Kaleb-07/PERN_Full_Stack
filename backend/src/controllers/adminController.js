import { prisma } from "../config/db.js";

/** GET /admin/stats */
const getStats = async (req, res) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalUsers, totalMovies, totalWatchlistItems, newUsersThisWeek, watchlistByStatus] =
        await Promise.all([
            prisma.user.count(),
            prisma.movie.count(),
            prisma.watchlistItem.count(),
            prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.watchlistItem.groupBy({
                by: ["status"],
                _count: { status: true },
            }),
        ]);

    // Compute top genres from all movies
    const allMovies = await prisma.movie.findMany({ select: { genres: true } });
    const genreCount = {};
    allMovies.forEach((m) => {
        m.genres.forEach((g) => {
            genreCount[g] = (genreCount[g] || 0) + 1;
        });
    });
    const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([genre, count]) => ({ genre, count }));

    // Recent users (last 5)
    const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(200).json({
        status: "success",
        data: {
            totalUsers,
            totalMovies,
            totalWatchlistItems,
            newUsersThisWeek,
            watchlistByStatus,
            topGenres,
            recentUsers,
        },
    });
};

/** GET /admin/users  — paginated + search */
const getAllUsers = async (req, res) => {
    const { page = 1, limit = 15, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
        ? {
              OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
              ],
          }
        : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: parseInt(limit),
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        movies: true,
                        watchListItem: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
    ]);

    res.status(200).json({
        status: "success",
        data: {
            users,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
        },
    });
};

/** PATCH /admin/users/:id/role */
const updateUserRole = async (req, res) => {
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
        return res
            .status(400)
            .json({ error: "Invalid role. Must be USER or ADMIN" });
    }

    if (req.params.id === req.user.id) {
        return res.status(400).json({ error: "You cannot change your own role" });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
    });

    res.status(200).json({ status: "success", data: { user: updated } });
};

/** DELETE /admin/users/:id */
const deleteUser = async (req, res) => {
    if (req.params.id === req.user.id) {
        return res
            .status(400)
            .json({ error: "You cannot delete your own account" });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found" });

    await prisma.user.delete({ where: { id: req.params.id } });

    res.status(200).json({ status: "success", message: "User deleted successfully" });
};

/** GET /admin/movies  — paginated + search */
const getAdminMovies = async (req, res) => {
    const { page = 1, limit = 15, search = "", genre = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) where.title = { contains: search, mode: "insensitive" };
    if (genre)  where.genres = { has: genre };

    const [movies, total] = await Promise.all([
        prisma.movie.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                creator: { select: { id: true, name: true, email: true } },
                _count: { select: { watchItems: true } },
            },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.movie.count({ where }),
    ]);

    res.status(200).json({
        status: "success",
        data: {
            movies,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
        },
    });
};

/** POST /admin/movies */
const createAdminMovie = async (req, res) => {
    const { 
        title, 
        overview, 
        releaseYear, 
        genres, 
        runtime, 
        posterUrl,
        backdropUrl,
        trailerUrl,
        rating,
        isFeatured 
    } = req.body;

    if (!title || !releaseYear) {
        return res
            .status(400)
            .json({ error: "Title and release year are required" });
    }

    const movie = await prisma.movie.create({
        data: {
            title,
            overview: overview || null,
            releaseYear: parseInt(releaseYear),
            genres: Array.isArray(genres) ? genres : (genres ? genres.split(",").map((g) => g.trim()) : []),
            runtime: runtime ? parseInt(runtime) : null,
            posterUrl: posterUrl || null,
            backdropUrl: backdropUrl || null,
            trailerUrl: trailerUrl || null,
            rating: rating ? parseFloat(rating) : 0.0,
            isFeatured: isFeatured === true || isFeatured === "true",
            createdBy: req.user.id,
        },
    });

    res.status(201).json({ status: "success", data: { movie } });
};

/** DELETE /admin/movies/:id */
const deleteAdminMovie = async (req, res) => {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    await prisma.movie.delete({ where: { id: req.params.id } });

    res.status(200).json({ status: "success", message: "Movie deleted successfully" });
};

export {
    getStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminMovies,
    createAdminMovie,
    deleteAdminMovie,
};
