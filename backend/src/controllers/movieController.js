import { prisma } from "../config/db.js";

/** GET /movies  — public */
const getAllMovies = async (req, res) => {
    const { search = "", genre = "" } = req.query;

    const where = {};
    if (search) where.title = { contains: search, mode: "insensitive" };
    if (genre)  where.genres = { has: genre };

    const movies = await prisma.movie.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        include: {
            creator: { select: { id: true, name: true } },
            _count: { select: { watchItems: true } },
        },
    });

    res.status(200).json({ status: "success", data: movies });
};

/** GET /movies/:id  — public */
const getMovieById = async (req, res) => {
    const movie = await prisma.movie.findUnique({
        where: { id: req.params.id },
        include: {
            creator: { select: { id: true, name: true } },
            _count: { select: { watchItems: true } },
        },
    });

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    res.status(200).json({ status: "success", data: movie });
};

/** POST /movies  — protected */
const createMovie = async (req, res) => {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

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
            genres: genres || [],
            runtime: runtime ? parseInt(runtime) : null,
            posterUrl: posterUrl || null,
            createdBy: req.user.id,
        },
    });

    res.status(201).json({ status: "success", data: movie });
};

/** PUT /movies/:id  — protected (owner or admin) */
const updateMovie = async (req, res) => {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (movie.createdBy !== req.user.id && req.user.role !== "ADMIN") {
        return res
            .status(403)
            .json({ error: "Not authorized to update this movie" });
    }

    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

    const updated = await prisma.movie.update({
        where: { id: req.params.id },
        data: {
            ...(title !== undefined && { title }),
            ...(overview !== undefined && { overview }),
            ...(releaseYear !== undefined && { releaseYear: parseInt(releaseYear) }),
            ...(genres !== undefined && { genres }),
            ...(runtime !== undefined && { runtime: runtime ? parseInt(runtime) : null }),
            ...(posterUrl !== undefined && { posterUrl }),
        },
    });

    res.status(200).json({ status: "success", data: updated });
};

/** DELETE /movies/:id  — protected (owner or admin) */
const deleteMovie = async (req, res) => {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (movie.createdBy !== req.user.id && req.user.role !== "ADMIN") {
        return res
            .status(403)
            .json({ error: "Not authorized to delete this movie" });
    }

    await prisma.movie.delete({ where: { id: req.params.id } });
    res.status(200).json({ status: "success", message: "Movie deleted" });
};

export { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
