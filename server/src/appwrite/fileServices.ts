import { InputFile } from "node-appwrite/dist/inputFile";
import { ID } from "node-appwrite";
import { storage } from "./appwrite"

const BUCKET_ID = process.env.APPWRITE_BUCKET_ID!;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.APPWRITE_ENDPOINT!;

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

export const getFileDownloadLink = (bucketId: string, fileId: string) => {
    return `${ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/download?project=${PROJECT_ID}`;
};

export const getFilePreviewLink = (bucketId: string, fileId: string) => {
    return `${ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/preview`;
};


export const deleteFileFromAppwriteStorage = async (fileId: string) => {
    return await storage.deleteFile({ bucketId: BUCKET_ID, fileId: fileId });
}

