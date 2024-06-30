import mongoose, { Document, Schema } from "mongoose";
import FileItemModel, { FileItemInterface } from "./fileItemModels";

export interface AlbumInterface {
    _id: mongoose.Types.ObjectId;
    avatarUrl: string;
    albumName: string;
    description: string;
    fileIds: mongoose.Types.ObjectId[];
}

export interface AlbumListInterface extends Document {
    userId: string;
    albumList: AlbumInterface[];
}

const albumSchema = new mongoose.Schema<AlbumInterface>(
    {
        avatarUrl: {
            type: String,
            required: true,
        },
        albumName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        fileIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FileItem'
        }],
    },
    {
        timestamps: true,
    }
);

const albumListSchema = new mongoose.Schema<AlbumListInterface>(
    {
        userId: {
            type: String,
            required: true,
        },
        albumList: [albumSchema]
    }
)

const AlbumModel = mongoose.model<AlbumListInterface>('AlbumList', albumListSchema);
export default AlbumModel;
