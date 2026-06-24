import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
        error.message = "Invalid file type. Only .png, .jpeg, and .pdf are allowed.";
        cb(error);
    }
};

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('file');
