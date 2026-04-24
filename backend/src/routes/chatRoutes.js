import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:roomId', getMessages);
router.get('/', getMessages);
router.post('/', sendMessage);

export default router;
