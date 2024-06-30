import { Request, Response } from "express";
import { AlbumInterface, AlbumListInterface } from "../models/albumModels";
import { handleAddFileToAlbum, handleCreateAlbum, handleGetAllAlbum, handleViewFileInAlbum } from "../services/albumService";
import { FileItemInterface } from "../models/fileItemModels";

export interface FileData {
    errCode: number;
    errMessage: string;
    file?: Partial<AlbumListInterface>[]
}

export interface FileViewData {
    errCode: number;
    errMessage: string;
    file?: Partial<FileItemInterface>[];
}

export const CreateAlbum = async (req: Request, res: Response): Promise<void> => {
    const { userId, avatarUrl, albumName, description } = req.body;

    console.log('check controller');

    if (!userId) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'You must log in to create new Album!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    if (!albumName) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'Missing album name!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    try {
        const fileData = await handleCreateAlbum(userId, avatarUrl, albumName, description);

        const response: FileData = {
            errCode: fileData.errCode,
            errMessage: fileData.errMessage,
            file: fileData.file ? fileData.file : []
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ errCode: 2, errMessage: 'Internal server error', file: [] });
    }
};

export const getALlAlbum = async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const arg = req.query.arg;

    console.log('check controller');

    if (!userId || !arg) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and arg is required!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleGetAllAlbum(userId.toString(), arg.toString());

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
};

export const addFileToAlbum = async (req: Request, res: Response): Promise<void> => {
    const { userId, albumId, file } = req.body;

    console.log('check controller');

    if (!userId || !albumId) {
        const errorResponse: FileData = {
            errCode: 1,
            errMessage: 'The userId and albumId is required!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleAddFileToAlbum(userId, albumId, file);

    const response: FileData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
};

export const viewFileInAlbum = async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const albumId = req.query.albumId;

    console.log('check controller');

    if (!userId || !albumId) {
        const errorResponse: FileViewData = {
            errCode: 1,
            errMessage: 'The userId and albumId is required!',
            file: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    const fileData = await handleViewFileInAlbum(userId.toString(), albumId.toString());
    console.log('check data: ', fileData.file);

    const response: FileViewData = {
        errCode: fileData.errCode,
        errMessage: fileData.errMessage,
        file: fileData.file ? fileData.file : []
    }

    res.status(200).json(response)
};