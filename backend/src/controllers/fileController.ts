import { Request, Response } from "express";
import { FileInterface } from "../models/fileModels";
import { handleUploadFile } from "../services/fileServices";


export interface FileData {
    errCode: number;
    errMessage: string;
    file?: Partial<FileInterface>;
}

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
    let imageUrl = req.body.imageUrl;
    let videoUrl = req.body.videoUrl;

    if (!imageUrl && !videoUrl) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'There is no image or video to upload!',
            file: {}
        };
        res.status(400).json(errorResponse);
        return;
    }

    let fileData = await handleUploadFile(imageUrl, videoUrl);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : {}
    };

    res.status(200).json(response);
}