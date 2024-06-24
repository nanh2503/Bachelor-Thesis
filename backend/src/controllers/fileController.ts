import { Request, Response } from "express";
import { FileListInterface } from "../models/fileModels";
import { handleClickService, handleDeleteDataService, handleFetchDataService, handleSetFavoriteService, handleUpdateDataService, handleUploadFile, hanldeGetFavoriteFileService } from "../services/fileServices";


export interface FileData {
    errCode: number;
    errMessage: string;
    file?: Partial<FileListInterface>[];
}

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
    const { userId, imageUrl, videoUrl, titles, descriptions, tagList } = req.body;

    if (!userId) {
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

    const fileData = await handleUploadFile(userId, imageUrl, videoUrl, titles, descriptions, tagList);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    };

    res.status(200).json(response);
}

export const handleFetchData = async (req: Request, res: Response): Promise<void | FileListInterface[]> => {
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

export const handleGetFavoriteFile = async (req: Request, res: Response): Promise<void | FileListInterface[]> => {
    const userId = req.query.userId;
    const page = parseInt(req.query.page?.toString() ?? '1', 10);

    if (!userId) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId is required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await hanldeGetFavoriteFileService(userId.toString(), page);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const updateData = async (req: Request, res: Response): Promise<void | FileListInterface> => {
    const { userId, fileType, id, title, description, tagList } = req.body;

    if (!id || !userId) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and id are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleUpdateDataService(userId, fileType, id, title, description, tagList);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const deleteData = async (req: Request, res: Response): Promise<void | FileListInterface> => {
    const { userId, fileType, id } = req.query;

    if (!userId || !id || !fileType) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleDeleteDataService(userId.toString(), fileType.toString(), id.toString());

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const handleClickIncrease = async (req: Request, res: Response): Promise<void | FileListInterface> => {
    const { userId, fileType, id } = req.body;

    if (!userId || !fileType || !id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleClickService(userId, fileType, id);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}

export const handleSetFavoriteFile = async (req: Request, res: Response): Promise<void | FileListInterface> => {
    const { userId, fileType, id } = req.body;

    if (!userId || !fileType || !id) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and id and fileType are required',
            file: []
        }
        res.status(400).json(errorResponse);
        return;
    }
    const fileData = await handleSetFavoriteService(userId, fileType, id);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
}