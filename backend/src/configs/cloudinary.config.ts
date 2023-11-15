import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';
import multer from 'multer';

interface CloudinaryParams {
    folder: string;
    [key: string]: any;
}

interface ExtendedOptions extends Options {
    allowedFormats?: string[];
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_KEY as string,
    api_secret: process.env.CLOUDINARY_SECRET as string
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'images'
    } as CloudinaryParams
} as ExtendedOptions);

const uploadCloud = multer({ storage });

export default uploadCloud;
