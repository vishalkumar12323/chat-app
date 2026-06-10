import express from 'express';
const router = express.Router();
import { getUsers } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

router.use(authMiddleware);

router.get('/', getUsers);

export default router;
