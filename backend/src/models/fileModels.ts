import mongoose, { Document, Schema } from "mongoose";

export interface FileInterface {
    _id: mongoose.Types.ObjectId;
    imageIds: mongoose.Types.ObjectId[];
    videoIds: mongoose.Types.ObjectId[];
    title?: string;
    tagList?: string[];
}

export interface FileListInterface extends Document {
    userId: string;
    fileList: FileInterface[];
    imagesNum: number;
    videosNum: number;
}

const fileSchema = new Schema<FileInterface>({
    imageIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    videoIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    title: {
        type: String,
        required: false,
    },
    tagList: {
        type: [String],
        required: false,
    },
});

const fileListSchema = new Schema<FileListInterface>({
    userId: {
        type: String,
        required: true,
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
}, {
    timestamps: true,
});

fileListSchema.index({ userId: 1 });

const FileList = mongoose.model<FileListInterface>('FileList', fileListSchema);

export default FileList;
