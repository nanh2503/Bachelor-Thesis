import mongoose, { Document } from "mongoose";

export interface FileImage extends Document {
    imageUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
}

export interface FileVideo extends Document {
    videoUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
}

export interface FileInterface {
    images: FileImage[];
    videos: FileVideo[];
    title: string;
    tagList: string[];
}

export interface FileListInterface extends Document {
    userId: string;
    fileList: FileInterface[];
    imagesNum: number;
    videosNum: number;
}

const imageSchema = new mongoose.Schema<FileImage>({
    imageUrl: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    clickNum: {
        type: Number,
        required: false,
    },
    isFavorite: {
        type: Boolean,
        required: false,
    }
});

const videoSchema = new mongoose.Schema<FileVideo>({
    videoUrl: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    clickNum: {
        type: Number,
        required: false,
    },
    isFavorite: {
        type: Boolean,
        required: false,
    }
});

const fileSchema = new mongoose.Schema<FileInterface>(
    {
        images: [imageSchema],
        videos: [videoSchema],
        title: {
            type: String,
            required: false,
        },
        tagList: {
            type: [String],
            required: false
        },
    },
    {
        timestamps: true,
    }
);

const schema = new mongoose.Schema<FileListInterface>(
    {
        userId: {
            type: String,
            required: true
        },
        fileList: [fileSchema],
        imagesNum: {
            type: Number,
            required: true,
        },
        videosNum: {
            type: Number,
            required: true,
        },
    }
)

const FileList = mongoose.model<FileListInterface>('fileList', schema);

export default FileList;
