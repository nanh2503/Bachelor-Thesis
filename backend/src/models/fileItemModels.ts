import mongoose, { Document } from "mongoose";

export interface FileItemInterface extends Document {
    fileUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
    title?: string;
    tagList?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const fileItemSchema = new mongoose.Schema<FileItemInterface>({
    fileUrl: {
        type: String,
        required: true,
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
    },
    title: {
        type: String,
        required: false,
    },
    tagList: {
        type: [String],
        required: false,
    },
});

const FileItemModel = mongoose.model<FileItemInterface>('FileItem', fileItemSchema);
export default FileItemModel;
