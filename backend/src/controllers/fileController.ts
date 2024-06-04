import { Request, Response } from "express";
import { FileInterface } from "../models/fileModels";
import { handleClickService, handleDeleteDataService, handleFetchDataService, handleSetFavoriteService, handleUpdateDataService, handleUploadFile } from "../services/fileServices";


export interface FileData {
    errCode: number;
    errMessage: string;
    file?: Partial<FileInterface>[];
}

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
    const { username, imageUrl, videoUrl, titles, descriptions, base64CodeImage, base64CodeVideo, tagList } = req.body;

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

    const fileData = await handleUploadFile(username, imageUrl, videoUrl, titles, descriptions, base64CodeImage, base64CodeVideo, tagList);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    };

    res.status(200).json(response);
}

export const handleFetchData = async (req: Request, res: Response): Promise<void | File[]> => {
    const arg = req.query.arg;
    const page = parseInt(req.query.page?.toString() ?? '1', 10);

    if (!arg) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The arg is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleFetchDataService(arg.toString(), page);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)

}

export const updateData = async (req: Request, res: Response): Promise<void | File> => {
    const { id, title, description } = req.body;

    if (!id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleUpdateDataService(id, title, description);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const deleteData = async (req: Request, res: Response): Promise<void | File> => {
    const { fileType, id } = req.query;

    if (!id || !fileType) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleDeleteDataService(fileType.toString(), id.toString());

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const handleClickIncrease = async (req: Request, res: Response): Promise<void | File> => {
    const { fileType, id } = req.body;

    if (!fileType || !id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleClickService(fileType, id);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const handleSetFavoriteFile = async (req: Request, res: Response): Promise<void | File> => {
    const { fileType, id } = req.body;

    if (!fileType || !id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }
    const fileData = await handleSetFavoriteService(fileType, id);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}