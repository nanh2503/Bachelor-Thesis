import mongoose, { Document } from "mongoose";

export interface VideoInterface extends Document {
    videoUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
}

const videoSchema = new mongoose.Schema<VideoInterface>({
    videoUrl: {
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

const VideoModel = mongoose.model<VideoInterface>('Video', videoSchema);

export default VideoModel;
