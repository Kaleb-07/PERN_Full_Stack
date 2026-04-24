import { prisma } from '../config/db.js';

export const createSchedule = async (req, res) => {
    try {
        const { movieId, scheduledAt } = req.body;
        const userId = req.user.id;

        const schedule = await prisma.schedule.create({
            data: {
                userId,
                movieId,
                scheduledAt: new Date(scheduledAt)
            },
            include: {
                movie: true
            }
        });

        res.status(201).json({
            status: "success",
            data: schedule
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getSchedules = async (req, res) => {
    try {
        const userId = req.user.id;
        const schedules = await prisma.schedule.findMany({
            where: { userId },
            include: { movie: true },
            orderBy: { scheduledAt: 'asc' }
        });

        res.status(200).json({
            status: "success",
            data: schedules
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.schedule.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
