import { AlbumInterface } from "../models/albumModels";
import AlbumModel from "../models/albumModels";
import FileItemModel, { FileItemInterface } from "../models/fileItemModels";
import { FileData, FileViewData } from "../controllers/albumController";
import mongoose from "mongoose";

export const handleCreateAlbum = (
    userId: string,
    avatarUrl: string,
    albumName: string,
    description: string,
): Promise<FileData> => {
    console.log('check userId: ', userId);

    return new Promise(async (resolve, reject) => {
        try {
            const newAlbum: AlbumInterface = {
                _id: new mongoose.Types.ObjectId(),
                avatarUrl,
                albumName,
                description,
                fileIds: [],
            };

            let albumList = await AlbumModel.findOne({ userId });

            if (!albumList) {
                albumList = new AlbumModel({
                    userId,
                    albumList: [newAlbum],
                });
            } else {
                albumList.albumList.push(newAlbum);
            }

            const savedAlbum = await albumList.save();

            let fileData: FileData = {
                errCode: 0,
                errMessage: 'Create new album successful!',
                file: [savedAlbum]
            };

            resolve(fileData);
        } catch (error) {
            console.error('Error in create new Album:', error);
            reject({
                errCode: 2,
                errMessage: 'Failed to create album',
                file: []
            });
        }
    });
};

export const handleGetAllAlbum = async (userId: string, arg: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        if (arg === 'All') {
            const albumList = await AlbumModel.find({ userId: userId }, { _id: 1, userId: 1, albumList: 1 })
                .populate({
                    path: 'albumList',
                    populate: [
                        { path: 'fileIds', model: 'FileItem' }
                    ]
                })

            fileData.errCode = 0;
            fileData.errMessage = 'Get all Album successful!';
            fileData.file = albumList;
        } else if (arg === 'newest') {
            const albumList = await AlbumModel.find({ userId: userId }, { _id: 1, userId: 1, albumList: 1 })
                .sort({ createdAt: -1 })
                .limit(1)
                .populate({
                    path: 'albumList',
                    populate: [
                        { path: 'fileIds', model: 'FileItem' }
                    ]
                })

            fileData.errCode = 0;
            fileData.errMessage = 'Get Newest File successful!';
            fileData.file = albumList;
        }

        return fileData;
    } catch (e) {
        console.error('Error in get all Album:', e);
        throw e;
    }
}

export const handleAddFileToAlbum = async (userId: string, albumId: string, file: FileItemInterface): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        const albumExist = await AlbumModel.findOne({ userId: userId, 'albumList._id': albumId });

        if (!albumExist) {
            fileData.errCode = 2;
            fileData.errMessage = 'Album not found!';
        } else {
            const newFile: FileItemInterface = new FileItemModel({
                ...file
            });

            const savedFile = await newFile.save();

            albumExist.albumList.forEach(album => {
                if (album._id.toString() === albumId) {
                    album.fileIds.push(savedFile._id);
                }
            });

            await albumExist.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Add file to Album successful!';
        }

        return fileData;
    } catch (e) {
        console.error('Error in Add file to Album:', e);
        throw e;
    }
}

export const handleViewFileInAlbum = async (userId: string, albumId: string): Promise<FileViewData> => {
    try {
        let fileData: FileViewData = { errCode: -1, errMessage: '', file: [] };

        // Find the album and populate the fileIds
        const album = await AlbumModel.findOne({ userId: userId, 'albumList._id': albumId })
            .populate({
                path: 'albumList.fileIds',
                model: 'FileItem'
            });

        if (!album) {
            fileData.errCode = 2;
            fileData.errMessage = 'Album not found!';
        } else {
            // Find the specific album
            const selectedAlbum = album.albumList.find(album => album._id.toString() === albumId);

            if (!selectedAlbum) {
                fileData.errCode = 2;
                fileData.errMessage = 'Album not found!';
            } else {
                const filesInAlbum = selectedAlbum.fileIds as unknown as FileItemInterface[];

                fileData.errCode = 0;
                fileData.errMessage = 'Get Files in Album successful!';
                fileData.file = filesInAlbum;
            }
        }

        return fileData;
    } catch (e) {
        console.error('Error in Get All Files in Album:', e);
        throw new Error('Failed to get all files in album');
    }
};