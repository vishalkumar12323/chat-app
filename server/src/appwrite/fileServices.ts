import { InputFile } from "node-appwrite/file";
import { ID } from "node-appwrite";
import { storage } from "./appwrite"
import { env } from "../config/env";


export const uploadFileToAppwriteStorage = async (file: Buffer, fileName: string) => {
    const appwriteFile = InputFile.fromBuffer(file, fileName);

    const response = await storage.createFile({
        bucketId: env.appwrite_bucket_id,
        file: appwriteFile,
        fileId: ID.unique(),
    });

    return {
        fileId: response.$id,
        bucketId: response.bucketId,
        fileName: response.name,
        mimeType: response.mimeType,
        fileSize: response.sizeOriginal
    }
};

export const getFileFromAppwriteStorage = async (fileId: string) => {
    return await storage.getFile({
        bucketId: env.appwrite_bucket_id,
        fileId: fileId
    });
};

export const getFileDownloadLink = (bucketId: string, fileId: string) => {
    return `${env.appwrite_endpoint}/storage/buckets/${bucketId}/files/${fileId}/download?project=${env.appwrite_project_id}`;
};

export const getFilePreviewLink = (bucketId: string, fileId: string) => {
    return `${env.appwrite_endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview`;
};


export const deleteFileFromAppwriteStorage = async (fileId: string) => {
    return await storage.deleteFile({ bucketId: env.appwrite_bucket_id, fileId: fileId });
}

