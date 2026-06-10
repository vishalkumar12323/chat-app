import express from 'express';
const router = express.Router();
import { getMessages, getDirectMessages } from '../controllers/messageController';
import authMiddleware from '../middleware/authMiddleware';

router.use(authMiddleware);

router.get('/direct/:userId', getDirectMessages);
router.get('/:channelId', getMessages);

export default router;
