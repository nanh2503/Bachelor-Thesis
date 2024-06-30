import mongoose, { Document } from "mongoose";

export interface ImageInterface extends Document {
    imageUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
}

const imageSchema = new mongoose.Schema<ImageInterface>({
    imageUrl: {
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
    }
});

const ImageModel = mongoose.model<ImageInterface>('Image', imageSchema);

export default ImageModel;
