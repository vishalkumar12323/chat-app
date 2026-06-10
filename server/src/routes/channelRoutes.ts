import express from 'express';
const router = express.Router();
import { createChannel, getChannels, joinChannel, getMyChannels } from '../controllers/channelController';
import authMiddleware from '../middleware/authMiddleware';

router.use(authMiddleware); // Protect all channel routes

router.post('/', createChannel);
router.get('/', getChannels);
router.post('/:id/join', joinChannel);
router.get('/me', getMyChannels);

export default router;
