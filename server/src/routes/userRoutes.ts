import express from 'express';
const router = express.Router();
import { getUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.use(authMiddleware);

router.get('/', getUsers);

export default router;
