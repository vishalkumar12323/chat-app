import express from 'express';
const router = express.Router();

import { deleteFile, downloadFile, getFileById, uploadFile } from "../controllers/fileController";
import authMiddleware from "../middleware/authMiddleware";

router.use(authMiddleware) // Apply authentication middleware to all files routes.

router.post('/upload', uploadFile);
router.get('/:id', getFileById);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);

export default router;