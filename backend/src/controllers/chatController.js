import { prisma } from '../config/db.js';

export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await prisma.message.findMany({
            where: { roomId: roomId || 'general' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: 50
        });

        res.status(200).json({
            status: "success",
            data: messages
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { content, roomId } = req.body;
        const userId = req.user.id;

        const message = await prisma.message.create({
            data: {
                content,
                roomId: roomId || 'general',
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            }
        });

        res.status(201).json({
            status: "success",
            data: message
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
