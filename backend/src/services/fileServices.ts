import { FileData } from "../controllers/fileController";
import FileList, { FileImage, FileVideo } from "../models/fileModels";

export const handleUploadFile = (username: string, imageUrl: string[], videoUrl: string[], title: string, description: string[], tagList: string[]): Promise<FileData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '' };

            const images = imageUrl.map((image, index) => ({
                imageUrl: image || '',
                description: description[index] || '',
                clickNum: 0,
                isFavorite: false,
            }));

            const videos = videoUrl.map((video, index) => ({
                videoUrl: video || '',
                description: description[index + imageUrl.length] || '',
                clickNum: 0,
                isFavorite: false,
            }));

            const fileList = {
                images: images as unknown as FileImage[],
                videos: videos as unknown as FileVideo[],
                title: title,
                tagList: tagList
            }

            const userFileList = await FileList.findOne({ username: username })

            if (!userFileList) {
                const newFileList = new FileList({
                    username: username,
                    fileList: fileList,
                    imagesNum: imageUrl.length,
                    videosNum: videoUrl.length
                })

                await newFileList.save();
                fileData.file = newFileList.toObject();
            } else {
                userFileList.username = username;
                userFileList.fileList = [...userFileList.fileList, fileList]
                userFileList.imagesNum += imageUrl.length;
                userFileList.videosNum += videoUrl.length;

                await userFileList.save();
            }

            fileData.errCode = 0;
            fileData.errMessage = 'Upload File successful!';

            resolve(fileData);
        } catch (e) {
            reject(e);
        }
    })
}

export const handleFetchDataService = async (arg: string, page?: number): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        if (arg === 'All') {
            const fileList = await FileList.find({}, { _id: 1, fileList: 1, imagesNum: 1, videosNum: 1 });

            fileData.errCode = 0;
            fileData.errMessage = 'Get File successful!';
            fileData.file = fileList;
        } else if (arg === 'newest') {
            const fileList = await FileList.find({}, { _id: 1, fileList: 1, imagesNum: 1, videosNum: 1 })
                .sort({ createdAt: -1 })
                .limit(1);

            fileData.errCode = 0;
            fileData.errMessage = 'Get Newest File successful!';
            fileData.file = fileList;
        }
        else {
            if (page) {
                if (page < 0) page = 1;
                const limit = 1;
                const skip = (page - 1) * limit;
                console.log('check arg: ', arg);

                const fileList = await FileList.aggregate([
                    { $match: { username: arg } },
                    {
                        $project: {
                            fileList: { $slice: ["$fileList", skip, limit] },
                            imagesNum: 1,
                            videosNum: 1
                        }
                    }
                ])

                fileData.errCode = 0;
                fileData.errMessage = 'Get File successful!';
                fileData.file = fileList;
            }
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const hanldeGetFavoriteFileService = (username: string, page?: number): Promise<FileData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '' };

            if (page) {
                const limit = 1;
                const skip = (page - 1) * limit;

                const fileList = await FileList.aggregate([
                    { $match: { username: username } },
                    {
                        $project: {
                            fileList: {
                                $map: {
                                    input: "$fileList",
                                    as: "file",
                                    in: {
                                        images: {
                                            $filter: {
                                                input: "$$file.images",
                                                as: "image",
                                                cond: { $eq: ["$$image.isFavorite", true] }
                                            }
                                        },
                                        videos: {
                                            $filter: {
                                                input: "$$file.videos",
                                                as: "video",
                                                cond: { $eq: ["$$video.isFavorite", true] }
                                            }
                                        },
                                        title: "$$file.title",
                                        tagList: "$$file.tagList",
                                    }
                                }
                            }
                        }
                    },
                    { $skip: skip },
                    { $limit: limit }
                ]);

                fileData.errCode = 0;
                fileData.errMessage = 'Get File successful!';
                fileData.file = fileList;
            }

            resolve(fileData);
        } catch (e) {
            reject(e);
        }
    })
}

export const handleUpdateDataService = async (username: string, fileType: string, id: string, title: string, description: string, tagList: string[]): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        let existingData = await FileList.findOne({ username: username })

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found!';
            return fileData;
        }

        for (let file of existingData.fileList)
            if (fileType === 'image') {
                let updateFile = file.images.find(image => image.id === id);
                if (updateFile) {
                    file.title = title;
                    updateFile.description = description;
                    file.tagList = tagList;
                }
            } else {
                let updateFile = file.videos.find(video => video.id === id);
                if (updateFile) {
                    file.title = title;
                    updateFile.description = description;
                    file.tagList = tagList;
                }
            }

        // Lưu dữ liệu đã cập nhật vào MongoDB
        await existingData.save();

        fileData.errCode = 0;
        fileData.errMessage = 'Image data updated successfully!';


        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const handleDeleteDataService = async (username: string, fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };
        let existingData = await FileList.findOne({ username: username })

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        let fileUpdated = false;

        for (let file of existingData.fileList)
            if (fileType === 'image') {
                let updateFile = file.images.find(image => image.id === id);
                if (updateFile) {
                    file.images = file.images.filter(image => image.id !== id)
                    existingData.imagesNum -= 1;
                    fileUpdated = true;

                    if (file.images.length === 0 && file.videos.length === 0) {
                        existingData.fileList = existingData.fileList.filter(f => f !== file);
                    }
                }
            } else {
                let updateFile = file.videos.find(video => video.id === id);
                if (updateFile) {
                    file.videos = file.videos.filter(video => video.id !== id);
                    existingData.videosNum -= 1;
                    fileUpdated = true;

                    if (file.images.length === 0 && file.videos.length === 0) {
                        existingData.fileList = existingData.fileList.filter(f => f !== file);
                    }
                }
            }

        if (!fileUpdated) {
            fileData.errCode = 3;
            fileData.errMessage = 'File not found';
            return fileData;
        }

        await existingData.save();
        fileData.errCode = 0;
        fileData.errMessage = 'File updated successfully!';

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleClickService = async (username: string, fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] }
        let existingData = await FileList.findOne({ username: username })

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        let fileUpdated = false;

        for (let file of existingData.fileList)
            if (fileType === 'image') {
                let updateFile = file.images.find(image => image.id === id);
                if (updateFile) {
                    updateFile.clickNum += 1
                    fileUpdated = true;
                }
            } else {
                let updateFile = file.videos.find(video => video.id === id);
                if (updateFile) {
                    updateFile.clickNum += 1
                    fileUpdated = true;
                }
            }

        if (!fileUpdated) {
            fileData.errCode = 3;
            fileData.errMessage = 'File not found';
            return fileData;
        }

        await existingData.save();
        fileData.errCode = 0;
        fileData.errMessage = 'Click increasing!'

        return fileData;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}

export const handleSetFavoriteService = async (username: string, fileType: string, id: string): Promise<FileData> => {

    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] }
        let existingData = await FileList.findOne({ username: username })

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
            return fileData;
        }

        let updateFile: { isFavorite: boolean } | undefined = undefined;

        for (let file of existingData.fileList) {
            if (fileType === 'image') {
                updateFile = file.images.find(image => image.id === id);
                if (updateFile) break;
            } else if (fileType === 'video') {
                updateFile = file.videos.find(video => video.id === id);
                if (updateFile) break;
            }
        }

        if (updateFile) {
            updateFile.isFavorite = !updateFile.isFavorite;
            await existingData.save(); // Lưu thay đổi
            fileData.errCode = 0;
            fileData.errMessage = 'Set favorite successful!';
        } else {
            fileData.errCode = 2;
            fileData.errMessage = 'File not found!';
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}
