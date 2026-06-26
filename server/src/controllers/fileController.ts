import { Request, Response } from "express";
import { File } from "../models";
import { upload } from "../multer/config";
import multer from "multer";
import { uploadFileToAppwriteStorage, deleteFileFromAppwriteStorage, getFileDownloadLink, getFilePreviewLink } from "../appwrite/fileServices"


export const uploadFile = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            const errorMsg = err.code === 'LIMIT_FILE_SIZE'
                ? 'File size too large. Maximum limit is 5MB.'
                : err.message;
            return res.status(400).json({ error: errorMsg });
        } else if (err) {
            return res.status(500).json({ error: 'An unknown error occurred during validation.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please select a file to upload.' });
        }

        try {
            const result = await uploadFileToAppwriteStorage(req.file.buffer, req.file.originalname);

            const fileRecord = await File.create({
                uploaded_by: req.user?.userId as string,
                bucket_id: result.bucketId,
                file_id: result.fileId,
                mime_type: result.mimeType,
                original_name: result.fileName,
                file_size: result.fileSize,
                download_url: getFileDownloadLink(result.bucketId, result.fileId),
                preview_url: getFilePreviewLink(result.bucketId, result.fileId),
            });

            // Return the full file record so the client can attach it to a message
            res.status(201).json(fileRecord.toJSON());
        } catch (appwriteError) {
            console.error('Appwrite Upload Error:', appwriteError);
            return res.status(500).json({
                error: 'Failed to upload file to storage.',
                details: (appwriteError as Error)?.message
            });
        }
    });
};


export const getFileById = async (req: Request, res: Response) => {
    const fileId = req.params.id as string;
    try {
        const fileMetaData = await File.findByPk(fileId);
        if (!fileMetaData) {
            return res.status(404).json({ message: "File not found" });
        }
        res.json(fileMetaData.toJSON());
    } catch (error) {
        console.error("Error Fetching File By ID:: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    const fileId = req.params.id as string;
    try {
        const fileRecord = await File.findByPk(fileId);
        if (!fileRecord) {
            return res.status(404).json({ message: "File not found" });
        }

        const fileData = fileRecord.toJSON() as any;
        // Delete from Appwrite using the Appwrite file_id, not the DB record id
        await deleteFileFromAppwriteStorage(fileData.file_id);
        await fileRecord.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Error Deleting File:: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};