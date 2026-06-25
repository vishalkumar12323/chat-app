import express from 'express';
const router = express.Router();

import { deleteFile, getFileById, uploadFile } from "../controllers/fileController";
import authMiddleware from "../middleware/authMiddleware";

router.use(authMiddleware) // Apply authentication middleware to all files routes.

router.post('/upload', uploadFile);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export default router;