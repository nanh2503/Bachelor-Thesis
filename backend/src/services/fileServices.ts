import mongoose, { Types } from "mongoose";
import { FileData } from "../controllers/fileController";
import FileList, { FileInterface, FileListInterface } from "../models/fileModels";
import ImageModel from "../models/imageModels";
import VideoModel from "../models/videoModels";

export const handleUploadFile = (userId: string, imageUrl: string[], videoUrl: string[], title: string, description: string[], tagList: string[]): Promise<FileData> => {

    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

            // Lưu các ảnh vào ImageModel và thu thập các ObjectId
            const imageIds: Types.ObjectId[] = [];
            for (let i = 0; i < imageUrl.length; i++) {
                const image = new ImageModel({
                    imageUrl: imageUrl[i],
                    description: description[i] || '',
                    clickNum: 0,
                    isFavorite: false,
                });
                const savedImage = await image.save();
                imageIds.push(savedImage._id);
            }

            // Lưu các video vào VideoModel và thu thập các ObjectId
            const videoIds: Types.ObjectId[] = [];
            for (let i = 0; i < videoUrl.length; i++) {
                const video = new VideoModel({
                    videoUrl: videoUrl[i],
                    description: description[i + imageUrl.length] || '',
                    clickNum: 0,
                    isFavorite: false,
                });
                const savedVideo = await video.save();
                videoIds.push(savedVideo._id);
            }

            const newFile: FileInterface = {
                _id: new mongoose.Types.ObjectId(),
                imageIds,
                videoIds,
                title,
                tagList,
            };

            // Kiểm tra xem người dùng đã có danh sách tệp hay chưa
            let fileList = await FileList.findOne({ userId });

            if (!fileList) {
                // Tạo danh sách tệp mới nếu chưa tồn tại
                fileList = new FileList({
                    userId,
                    fileList: [newFile],
                    imagesNum: imageIds.length,
                    videosNum: videoIds.length,
                });
            } else {
                // Cập nhật danh sách tệp hiện có
                fileList.fileList.push(newFile);
                fileList.imagesNum += imageIds.length;
                fileList.videosNum += videoIds.length;
            }

            // Lưu tệp danh sách đã cập nhật vào MongoDB
            await fileList.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Upload File successful!';
            fileData.file = fileList.toObject(); // Convert to plain JavaScript object

            resolve(fileData);
        } catch (error) {
            console.error('Error in handleUploadFile:', error);
            reject(error);
        }
    });
};

export const handleFetchDataService = async (arg: string, page?: number): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        if (arg === 'All') {
            const fileList = await FileList.find({}, { _id: 1, userId: 1, fileList: 1, imagesNum: 1, videosNum: 1 })
                .populate({
                    path: 'fileList',
                    populate: [
                        { path: 'imageIds', model: 'Image' },
                        { path: 'videoIds', model: 'Video' }
                    ]
                });

            fileData.errCode = 0;
            fileData.errMessage = 'Get File successful!';
            fileData.file = fileList;
        } else if (arg === 'newest') {
            const fileList = await FileList.find({}, { _id: 1, fileList: 1, imagesNum: 1, videosNum: 1 })
                .sort({ createdAt: -1 })
                .limit(1)
                .populate({
                    path: 'fileList',
                    populate: [
                        { path: 'imageIds', model: 'Image' },
                        { path: 'videoIds', model: 'Video' }
                    ]
                });

            fileData.errCode = 0;
            fileData.errMessage = 'Get Newest File successful!';
            fileData.file = fileList;
        } else {
            if (page) {
                if (page < 0) page = 1;
                const limit = 1;
                const skip = (page - 1) * limit;

                const fileList = await FileList.aggregate([
                    { $match: { userId: arg } },
                    {
                        $project: {
                            fileList: { $slice: ["$fileList", skip, limit] },
                            imagesNum: 1,
                            videosNum: 1
                        }
                    }
                ]);

                // Extract file IDs for further population
                const fileIds = fileList.map(file => file.fileList.map((f: FileInterface) => f._id)).flat();

                // Populate images and videos
                const populatedFiles = await FileList.populate(fileList, [
                    { path: 'fileList.imageIds', model: 'Image' },
                    { path: 'fileList.videoIds', model: 'Video' }
                ]);

                fileData.errCode = 0;
                fileData.errMessage = 'Get File successful!';
                fileData.file = populatedFiles;
            }
        }

        return fileData;
    } catch (e) {
        console.error('Error in handleFetchDataService:', e);
        throw e;
    }
};

export const hanldeGetFavoriteFileService = async (userId: string, page?: number): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '' };

        if (page) {
            const limit = 10;
            const skip = (page - 1) * limit;

            const fileList: Partial<FileListInterface>[] = await FileList.aggregate([
                { $match: { userId } },
                { $unwind: '$fileList' },
                {
                    $lookup: {
                        from: 'images',
                        localField: 'fileList.imageIds',
                        foreignField: '_id',
                        as: 'images'
                    }
                },
                {
                    $lookup: {
                        from: 'videos',
                        localField: 'fileList.videoIds',
                        foreignField: '_id',
                        as: 'videos'
                    }
                },
                {
                    $project: {
                        _id: '$fileList._id',
                        images: {
                            $filter: {
                                input: '$images',
                                as: 'image',
                                cond: { $eq: ['$$image.isFavorite', true] }
                            }
                        },
                        videos: {
                            $filter: {
                                input: '$videos',
                                as: 'video',
                                cond: { $eq: ['$$video.isFavorite', true] }
                            }
                        },
                        title: '$fileList.title',
                        tagList: '$fileList.tagList'
                    }
                },
                {
                    $match: {
                        $or: [
                            { 'images': { $exists: true, $ne: [] } },
                            { 'videos': { $exists: true, $ne: [] } }
                        ]
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);


            console.log('check fileList: ', fileList);

            fileData.errCode = 0;
            fileData.errMessage = 'Get File successful!';
            fileData.file = fileList;

            return fileData;
        }

        throw new Error('Invalid page number');
    } catch (error) {
        console.error('Error in Get Favorite Files:', error);
        throw new Error('Failed to get favorite files');
    }
};

export const handleUpdateDataService = async (userId: string, fileType: string, id: string, title: string, description: string, tagList: string[]): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        let existingFileList = await FileList.findOne({ userId: userId });

        if (!existingFileList) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found!';
            return fileData;
        }

        if (fileType === 'image') {
            const image = await ImageModel.findById(id);
            if (image) {
                image.description = description;
                await image.save();
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Image not found';
                return fileData;
            }
        } else if (fileType === 'video') {
            const video = await VideoModel.findById(id);
            if (video) {
                video.description = description;
                await video.save();
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Video not found';
                return fileData;
            }
        } else {
            fileData.errCode = 3;
            fileData.errMessage = 'Invalid file type';
            return fileData;
        }

        existingFileList.fileList.forEach(file => {
            if (file._id.toString() === id && file.imageIds.length > 0) {
                file.title = title;
                file.tagList = tagList;
            }
        });

        await existingFileList.save();

        fileData.errCode = 0;
        fileData.errMessage = `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} data updated successfully!`;

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const handleDeleteDataService = async (userId: string, fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };
        let existingFileList = await FileList.findOne({ userId: userId });

        if (!existingFileList) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        let fileUpdated = false;

        if (fileType === 'image') {
            const image = await ImageModel.findById(id);
            if (image) {
                await ImageModel.findByIdAndDelete(id);
                existingFileList.imagesNum -= 1;
                fileUpdated = true;
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Image not found';
                return fileData;
            }
        } else if (fileType === 'video') {
            const video = await VideoModel.findById(id);
            if (video) {
                await VideoModel.findByIdAndDelete(id);
                existingFileList.videosNum -= 1;
                fileUpdated = true;
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Video not found';
                return fileData;
            }
        } else {
            fileData.errCode = 3;
            fileData.errMessage = 'Invalid file type';
            return fileData;
        }

        if (!fileUpdated) {
            fileData.errCode = 3;
            fileData.errMessage = 'File not found in user file list';
            return fileData;
        }

        await existingFileList.save();
        fileData.errCode = 0;
        fileData.errMessage = 'File deleted successfully';

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleClickService = async (userId: string, fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        let existingFileList = await FileList.findOne({ userId: userId });

        if (!existingFileList) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        let fileUpdated = false;

        if (fileType === 'image') {
            const image = await ImageModel.findById(id);
            if (image) {
                image.clickNum += 1;
                await image.save();
                fileUpdated = true;
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Image not found';
                return fileData;
            }
        } else if (fileType === 'video') {
            const video = await VideoModel.findById(id);
            if (video) {
                video.clickNum += 1;
                await video.save();
                fileUpdated = true;
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Video not found';
                return fileData;
            }
        } else {
            fileData.errCode = 3;
            fileData.errMessage = 'Invalid file type';
            return fileData;
        }

        if (!fileUpdated) {
            fileData.errCode = 3;
            fileData.errMessage = 'File not found';
            return fileData;
        }

        fileData.errCode = 0;
        fileData.errMessage = 'Click increasing!';

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const handleSetFavoriteService = async (userId: string, fileType: string, id: string): Promise<FileData> => {

    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        let existingFileList = await FileList.findOne({ userId: userId });

        if (!existingFileList) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        if (fileType === 'image') {
            const image = await ImageModel.findById(id);
            console.log('check image: ', image);

            if (image) {
                image.isFavorite = !image.isFavorite;
                await image.save();
                fileData.errCode = 0;
                fileData.errMessage = 'Set favorite successful!';
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Image not found';
                return fileData;
            }
        } else if (fileType === 'video') {
            const video = await VideoModel.findById(id);
            if (video) {
                video.isFavorite = !video.isFavorite;
                await video.save();
                fileData.errCode = 0;
                fileData.errMessage = 'Set favorite successful!';
            } else {
                fileData.errCode = 3;
                fileData.errMessage = 'Video not found';
                return fileData;
            }
        } else {
            fileData.errCode = 3;
            fileData.errMessage = 'Invalid file type';
            return fileData;
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
