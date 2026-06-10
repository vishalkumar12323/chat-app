import express from 'express';
const router = express.Router();
import { register, login, getMe } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

export default router;
