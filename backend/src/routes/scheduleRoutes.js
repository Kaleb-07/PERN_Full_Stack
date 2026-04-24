import express from 'express';
import { createSchedule, getSchedules, deleteSchedule } from '../controllers/scheduleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createSchedule);
router.get('/', getSchedules);
router.delete('/:id', deleteSchedule);

export default router;
