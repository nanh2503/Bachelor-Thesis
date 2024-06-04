import { FileData } from "../controllers/fileController";
import File from "../models/fileModels";

export const handleUploadFile = (username: string, imageUrl: string[], videoUrl: string[], title: string, description: string[], base64CodeImage: string[], base64CodeVideo: string[], tagList: string[]): Promise<FileData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '' };

            const images: { imageUrl: string; description: string, base64CodeImage: string, clickNum: number, isFavorite: boolean }[] = [];
            base64CodeImage.forEach((base64CodeImage, index) => {
                images.push({ imageUrl: imageUrl[index] || '', description: description[index] || '', base64CodeImage, clickNum: 0, isFavorite: false });
            });

            const videos: { videoUrl: string; description: string, base64CodeVideo: string, clickNum: number, isFavorite: boolean }[] = [];
            base64CodeVideo.forEach((base64CodeVideo, index) => {
                videos.push({ videoUrl: videoUrl[index] || '', description: description[index + base64CodeImage.length] || '', base64CodeVideo, clickNum: 0, isFavorite: false });
            });

            const newFile = new File({
                username: username,
                images: images,
                videos: videos,
                title,
                tagList,
            });

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

export const handleFetchDataService = async (arg: string, page: number): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };
        const limit = 1;
        const skip = (page - 1) * limit;

        if (arg === 'All') {
            const fileList = await File.find({}, { _id: 1, images: 1, videos: 1, title: 1, tagList: 1 });

            fileData.errCode = 0;
            fileData.errMessage = 'Get File successful!';
            fileData.file = fileList;
        } else if (arg === 'newest') {
            const fileList = await File.find({}, { _id: 1, images: 1, videos: 1, title: 1, tagList: 1 })
                .sort({ createdAt: -1 })
                .limit(1);

            fileData.errCode = 0;
            fileData.errMessage = 'Get Newest File successful!';
            fileData.file = fileList;
        }
        else {
            const fileList = await File.find({ username: arg }, { _id: 1, images: 1, videos: 1, title: 1, tagList: 1 }).skip(skip).limit(limit);

            fileData.errCode = 0;
            fileData.errMessage = 'Get File successful!';
            fileData.file = fileList;
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleUpdateDataService = async (id: string, title: string, description: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        // Tìm file có mảng images chứa phần tử có _id tương ứng
        const existingData = await File.findOne({
            $or: [
                { 'images._id': id },
                { 'videos._id': id }
            ]
        });

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found!';
        } else {
            // Tìm và cập nhật thông tin của ảnh trong mảng images
            const updatedImage = existingData.images.id(id) ?? existingData.videos.id(id);

            if (updatedImage) {
                existingData.title = title;
                updatedImage.description = description;

                // Tạo một đối tượng chỉ chứa những trường mong muốn
                const updatedImageData = {
                    title: updatedImage.title,
                    description: updatedImage.description
                };

                fileData.file = [updatedImageData];

            } else {
                fileData.errCode = 2;
                fileData.errMessage = 'Image not found!';
            }

            // Lưu dữ liệu đã cập nhật vào MongoDB
            await existingData.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Image data updated successfully!';
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const handleDeleteDataService = async (fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        // Tìm kiếm dữ liệu theo id
        let existingData;

        if (fileType === 'image') {
            existingData = await File.findOne({ 'images._id': id })
        } else {
            existingData = await File.findOne({ 'videos._id': id })
        }

        if (existingData) {
            // Lọc ra ảnh cần xóa khỏi mảng
            if (fileType === 'image') {
                existingData.images = existingData.images.filter((image: any) => image._id.toString() !== id);
            } else {
                existingData.videos = existingData.videos.filter((video: any) => video._id.toString() !== id);
            }

            if (existingData.images.length === 0 && existingData.videos.length === 0) {
                await File.deleteOne({ _id: existingData._id });
                fileData.errCode = 0;
                fileData.errMessage = 'Clear File successfully!';
            } else {
                // Lưu dữ liệu đã cập nhật vào MongoDB
                await existingData.save();
                fileData.errCode = 0;
                fileData.errMessage = 'File updated successfully!';
            }
        } else {
            fileData.errCode = 2;
            fileData.errMessage = 'File not found!';
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleClickService = async (fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] }
        let existingData;

        if (fileType === 'image') {
            existingData = await File.findOne({ 'images._id': id })
        } else {
            existingData = await File.findOne({ 'videos._id': id })
        }

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
        } else {
            let updateFile;
            if (fileType === 'image') {
                updateFile = existingData.images.id(id);
            } else {
                updateFile = existingData.videos.id(id);
            }

            if (updateFile) {
                updateFile.clickNum = updateFile.clickNum + 1;
            } else {
                fileData.errCode = 2;
                fileData.errMessage = 'File not found!';
            }

            await existingData.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Click increasing!'
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}

export const handleSetFavoriteService = async (fileType: string, id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] }
        let existingData;

        if (fileType === 'image') {
            existingData = await File.findOne({ 'images._id': id })
        } else {
            existingData = await File.findOne({ 'videos._id': id })
        }

        if (!existingData) {
            fileData.errCode = 2;
            fileData.errMessage = 'Data not found';
        } else {
            let updateFile;
            if (fileType === 'image') {
                updateFile = existingData.images.id(id);
            } else {
                updateFile = existingData.videos.id(id);
            }

            if (updateFile) {
                updateFile.isFavorite = !updateFile.isFavorite;
            } else {
                fileData.errCode = 2;
                fileData.errMessage = 'File not found!';
            }

            await existingData.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Set favorite successful!'
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}
