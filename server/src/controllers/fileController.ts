import { Request, Response } from "express";
import { File, User } from "../models";
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
            await File.create({
                sender_id: req.user?.userId as string,
                bucket_id: result.bucketId,
                file_id: result.fileId,
                mime_type: result.mimeType,
                original_name: result.fileName,
                file_size: result.fileSize,
                download_url: getFileDownloadLink(result.bucketId, result.fileId),
                preview_url: getFilePreviewLink(result.bucketId, result.fileId),
            });

            res.status(201).json({ message: "file successfully uploaded." });
        } catch (appwriteError) {
            console.error('Appwrite Upload Error:', appwriteError);
            return res.status(500).json({
                error: 'Failed to upload file to storage network.',
                // @ts-ignore
                details: appwriteError?.message
            });
        }
    });
};


export const getFileById = async (req: Request, res: Response) => {
    const fileId = req.params.id || req.params.id[0];
    try {
        const fileMetaData = await File.findOne({ where: { id: fileId } });
        res.json(fileMetaData?.toJSON());
    } catch (error) {
        console.log("Error Fetching File By ID:: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    const fileId = req.params.id || req.params.id[0];
    try {
        await deleteFileFromAppwriteStorage(fileId as string);
        await File.destroy({ where: { file_id: fileId } });
        res.status(204).json({ message: "File deleted successfull." });
    } catch (error) {
        console.log("Error Deleting File By ID:: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};