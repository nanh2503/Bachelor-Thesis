import { handleGetSignatureForUpload, handleUploadCloudService } from "src/services/fileServices";

export const uploadFile = async (type: string, timestamp: number, signature: string, files: File[]) => {
    const folder = type === 'image' ? 'images' : 'videos';

    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const resourceType = type === 'image' ? 'image' : 'video';

        const uploadPromises = files.map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("timestamp", timestamp.toString());
            data.append("signature", signature);
            data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
            data.append("folder", folder);

            const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
            const res = await handleUploadCloudService(api, data);
            const { secure_url } = res.data;

            return secure_url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        return uploadedUrls;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to upload files");
    }
}

export const getSignatureForUpload = async (folder: string) => {
    try {
        const res = await handleGetSignatureForUpload(folder);

        return res.data;
    } catch (error) {
        console.error(error);
    }
}