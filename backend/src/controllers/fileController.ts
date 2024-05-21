import { Request, Response } from "express";
import { FileInterface } from "../models/fileModels";
import { handleDeleteDataService, handleFetchDataService, handleUpdateDataService, handleUploadFile } from "../services/fileServices";


export interface FileData {
    errCode: number;
    errMessage: string;
    file?: Partial<FileInterface>[];
}

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
    let { username, imageUrl, videoUrl, titles, descriptions, base64CodeImage, base64CodeVideo, tagList } = req.body;

    if (!username) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'You must log in to upload images or videos on this Website!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    if (!imageUrl && !videoUrl) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'There is no image or video to upload!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    let fileData = await handleUploadFile(username, imageUrl, videoUrl, titles, descriptions, base64CodeImage, base64CodeVideo, tagList);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    };

    res.status(200).json(response);
}

export const handleFetchData = async (req: Request, res: Response): Promise<void | File[]> => {
    let arg = req.query.arg;

    if (!arg) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The arg is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    let fileData = await handleFetchDataService(arg.toString());

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)

}

export const updateData = async (req: Request, res: Response): Promise<void | File> => {
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;

    if (!id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    let fileData = await handleUpdateDataService(id, title, description);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const deleteData = async (req: Request, res: Response): Promise<void | File> => {
    let { fileType, id } = req.query;

    if (!id || !fileType) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id and fileType is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    let fileData = await handleDeleteDataService(fileType.toString(), id.toString());

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}