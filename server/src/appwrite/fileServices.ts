import { InputFile } from "node-appwrite/dist/inputFile";
import { ID } from "node-appwrite";
import { storage } from "./appwrite"

const BUCKET_ID = process.env.APPWRITE_BUCKET_ID!
export const uploadFileToAppwriteStorage = async (file: Buffer, fileName: string) => {
    const appwriteFile = InputFile.fromBuffer(file, fileName);

    const response = await storage.createFile({
        bucketId: BUCKET_ID,
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
        bucketId: BUCKET_ID,
        fileId: fileId
    });
};

export const getFileDownloadLink = async (fileId: string) => {
    return await storage.getFileDownload({ bucketId: BUCKET_ID, fileId: fileId });
};


export const deleteFileFromAppwriteStorage = async (fileId: string) => {
    return await storage.deleteFile({ bucketId: BUCKET_ID, fileId: fileId });
}

