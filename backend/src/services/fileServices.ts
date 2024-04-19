import { FileData } from "../controllers/fileController";
import File from "../models/fileModels";

export const handleUploadFile = (username: string, imageUrl: string[], videoUrl: string[], title: string, description: string[], tagList: string[]): Promise<FileData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let fileData: FileData = { errCode: -1, errMessage: '' };

            const images: { imageUrl: string; description: string }[] = [];
            imageUrl.forEach((imageUrl, index) => {
                images.push({ imageUrl, description: description[index] || '' });
            });

            const videos: { videoUrl: string; description: string }[] = [];
            videoUrl.forEach((videoUrl, index) => {
                videos.push({ videoUrl, description: description[index + imageUrl.length] || '' });
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

export const handleFetchDataService = async (arg: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

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
            const fileList = await File.find({ username: arg }, { _id: 1, images: 1, videos: 1, title: 1, tagList: 1 });

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
            fileData.errCode = 0;
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
                fileData.errCode = 0;
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

export const handleDeleteDataService = async (id: string): Promise<FileData> => {
    try {
        let fileData: FileData = { errCode: -1, errMessage: '', file: [] };

        // Tìm kiếm dữ liệu theo id
        const existingData = await File.findOne({
            $or: [
                { 'images._id': id },
                { 'videos._id': id },
            ]
        });

        if (existingData) {
            // Lọc ra ảnh cần xóa khỏi mảng images
            existingData.images = existingData.images.filter((image: any) => image._id.toString() !== id);
            existingData.videos = existingData.videos.filter((video: any) => video._id.toString() !== id);

            // Lưu dữ liệu đã cập nhật vào MongoDB
            await existingData.save();

            fileData.errCode = 0;
            fileData.errMessage = 'Image deleted successfully!';
        } else {
            fileData.errCode = 0;
            fileData.errMessage = 'Image not found!';
        }

        return fileData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};