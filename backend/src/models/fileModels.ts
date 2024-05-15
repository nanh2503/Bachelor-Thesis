import mongoose, { Document } from "mongoose";

export interface FileImage {
    imageUrl: string;
    description: string;
    base64Code: string;
}

export interface FileVideo {
    videoUrl: string;
    description: string;
    base64Code: string;
}

export interface FileInterface extends Document {
    username: string,
    images: FileImage[];
    videos: FileVideo[];
    title: string;
    tagList: string[];
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
    base64Code: {
        type: String,
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
    base64Code: {
        type: String,
        required: false,
    }
});

const schema = new mongoose.Schema<FileInterface>(
    {
        username: {
            type: String,
            required: true
        },
        images: [imageSchema],
        videos: [videoSchema],
        title: {
            type: String,
            required: false,
        },
        tagList: {
            type: [String],
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const File = mongoose.models.file || mongoose.model<FileInterface>('file', schema);

export default File;
