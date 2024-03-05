import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from "express";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
})

export interface SignUploadData {
    errCode: number;
    errMessage: string;
    timestamp: number;
    signature: string
}

export const handlegenerateSignature = async (req: Request, res: Response): Promise<void> => {
    const folder = req.body.folder;
    console.log('check3');

    if (!folder) {
        const errorResponse: SignUploadData = {
            errCode: 1,
            errMessage: 'Folder name is required!',
            timestamp: -1,
            signature: ''
        };
        res.status(400).json(errorResponse);
        return;
    }

    try {
        const timestamp = Math.round((new Date).getTime() / 1000);

        const cloudSecret = process.env.CLOUDINARY_SECRET;
        console.log('cloudSecret: ', cloudSecret);

        if (cloudSecret) {
            const signature = cloudinary.utils.api_sign_request({
                timestamp,
                folder
            }, cloudSecret);
            const response: SignUploadData = {
                errCode: 0,
                errMessage: 'Get timestamp and signature successful!',
                timestamp: timestamp,
                signature: signature
            }
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}