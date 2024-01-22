import mongoose from "mongoose";

export interface FileInterface {
    imageUrl: string,
    videoUrl: string
}

const schema = new mongoose.Schema<FileInterface>(
    {
        imageUrl: {
            type: String,
            required: false
        },
        videoUrl: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const File = mongoose.models.file || mongoose.model<FileInterface>('file', schema);

export default File;