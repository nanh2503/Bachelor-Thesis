import { FileData } from "../controllers/fileController";
import File from "../models/fileModels";

export const handleUploadFile = (imageUrl: string, videoUrl: string): Promise<FileData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '' };

            const newFile = new File({
                imageUrl: imageUrl,
                videoUrl: videoUrl
            })

            await newFile.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Upload File successful!';
            fileData.file = newFile.toObject();

            resolve(fileData);
        } catch (e) {
            reject(e);
        }
    })
}