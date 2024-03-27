import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Dialog, CardMedia } from '@mui/material';
import { handleFetchData, handleGetSignatureForUpload, handleUploadBackendService, handleUploadCloudService } from 'src/services/fileServices';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'src/app/hooks';
import { updateFileList } from 'src/app/redux/slices/fileSlice';
import UploadForm from '../upload';
import { setTitles, setDescriptions } from 'src/app/redux/slices/uploadFileSlice';

const ReviewForm = () => {
    const user = useSelector((state) => state.loginState.user)
    const imagesReview = useSelector((state) => state.uploadFileState.imagesReview)
    const videosReview = useSelector((state) => state.uploadFileState.videosReview)
    const titles = useSelector((state) => state.uploadFileState.title)
    const descriptions = useSelector((state) => state.uploadFileState.descriptions)

    const router = useRouter();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);
    const [isAddMoreDialogOpen, setAddMoreDialogOpen] = useState(false);

    const base64ToBufferImage = (base64String: string) => {
        // Loại bỏ tiền tố 'data:image/jpeg;base64,' hoặc 'data:image/png;base64,'
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        // Chuyển đổi chuỗi base64 thành Buffer
        return Buffer.from(base64Data, 'base64');
    };

    const base64ToFileImage = (base64String: string) => {
        const buffer = base64ToBufferImage(base64String);
        // Tạo đối tượng File từ Buffer
        return new File([buffer], `image_${Date.now()}.jpg`, { type: "image/jpeg" });
    };

    const base64ToBufferVideo = (base64String: string) => {
        // Loại bỏ tiền tố 'data:image/jpeg;base64,' hoặc 'data:image/png;base64,'
        const base64Data = base64String.replace(/^data:video\/\w+;base64,/, '');
        // Chuyển đổi chuỗi base64 thành Buffer
        return Buffer.from(base64Data, 'base64');
    };

    const base64ToFileVideo = (base64String: string) => {
        const buffer = base64ToBufferVideo(base64String);
        // Tạo đối tượng File từ Buffer
        return new File([buffer], `video_${Date.now()}.mp4`, { type: "video/mp4" });
    };

    const handleTitleChange = (value: string) => {
        dispatch(setTitles(value));
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        dispatch(setDescriptions(newDescriptions))
    };

    const handleOpenAddMoreDialog = () => {
        setAddMoreDialogOpen(true);
    }

    const handleCloseAddMoreDialog = () => {
        setAddMoreDialogOpen(false);
    }

    const uploadFile = async (type: string, timestamp: number, signature: string, files: File[]) => {
        const folder = type === 'image' ? 'images' : 'videos';

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const resourceType = type === 'image' ? 'image' : 'video';

            const uploadPromises = files.map(async (file, index) => {
                const data = new FormData();
                data.append("file", file);
                data.append("timestamp", timestamp.toString());
                data.append("signature", signature);
                data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
                data.append("folder", folder);

                const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
                const res = await handleUploadCloudService(api, data);
                const { secure_url } = res.data;

                return secure_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            return uploadedUrls;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to upload files");
        }
    }

    const getSignatureForUpload = async (folder: string) => {
        try {
            const res = await handleGetSignatureForUpload(folder);

            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const fetchNewestData = async (arg: string) => {
        try {
            const response = await handleFetchData(arg);

            return response.data.file;
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddImages = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const imageFiles: File[] = [];
        const videoFiles: File[] = [];

        if (imagesReview.length > 0) {
            imagesReview.map((image) => {
                const imageFile = base64ToFileImage(image);
                imageFiles.push(imageFile);
            })
        }

        if (videosReview.length > 0) {
            videosReview.map((video) => {
                const videoFile = base64ToFileVideo(video);
                videoFiles.push(videoFile);
            })
        }

        try {
            setLoading(true);

            //Get signature for Image upload
            const { timestamp: imageTimestamp, signature: imageSignature } = await getSignatureForUpload('images');

            //Get signature for Video upload
            const { timestamp: videoTimestamp, signature: videoSignature } = await getSignatureForUpload('videos');

            //Upload image file
            const imageUrl = await uploadFile('image', imageTimestamp, imageSignature, imageFiles);

            //Upload video file
            const videoUrl = await uploadFile('video', videoTimestamp, videoSignature, videoFiles);

            const username = user?.username;

            if (!!username) {
                //Send backend api request
                await handleUploadBackendService(username, imageUrl, videoUrl, titles, descriptions);
            }


            const newFile = await fetchNewestData('newest')
            dispatch(updateFileList(newFile))

            setLoading(false);
            router.push("/")
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className='container'>
                <h1>Review Uploaded Files</h1>
                <div className='title-container'>
                    <Input
                        type='text'
                        placeholder='Enter title'
                        value={titles}
                        onChange={(e) => handleTitleChange(e.target.value)}
                    />
                </div>

                <div className='file-item'>
                    <div className='image-container'>
                        {imagesReview.map((image, index) => {
                            return (
                                <div key={index}>
                                    <img src={image} alt={`Uploaded Image File ${index + 1}`} className='file-image' />
                                    <div className='description-container'>
                                        <input
                                            placeholder='Add description'
                                            value={descriptions[index]}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            className='description-input'
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='video-container'>
                        {videosReview.map((video, index) => {
                            const indexVideo = index + imagesReview.length;
                            return (
                                <div key={indexVideo}>
                                    <video controls>
                                        <source src={video} type='video/mp4' className='file-video' />
                                    </video>
                                    <div className='description-container'>
                                        <input
                                            placeholder='Add description'
                                            value={descriptions[indexVideo]}
                                            onChange={(e) => handleDescriptionChange(indexVideo, e.target.value)}
                                            className='description-input'
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Button
                    sx={{
                        backgroundColor: 'green',
                        padding: '10px 30px',
                        color: 'white',
                        marginLeft: '50px',
                        borderRadius: '30px',
                        '&:hover': {
                            backgroundColor: 'limegreen',
                        },
                    }}
                    onClick={handleAddImages} className='add-images-button'>
                    <span><strong>+</strong></span> Add Files
                </Button>

                <Button
                    sx={{
                        backgroundColor: 'gray',
                        padding: '10px 30px',
                        color: 'white',
                        marginLeft: '70px',
                        borderRadius: '30px',
                        '&:hover': {
                            backgroundColor: 'gold',
                        },
                    }}
                    onClick={handleOpenAddMoreDialog} className='add-images-button'>
                    <span><strong>+</strong></span> Add More Files
                </Button>


            </div>

            {loading && <ThreeDots
                width={"80"}
                radius={"9"}
                color='#4fa94d'
                ariaLabel='three-dots-loading'
                wrapperStyle={{}}

                // wrapperClassName=""
                visible={true}
            />
            }

            <Dialog
                open={isAddMoreDialogOpen}
                onClose={() => setAddMoreDialogOpen(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        overflowY: 'visible',
                        background: 'none',
                    }
                }}
            >
                <UploadForm onUploadComplete={handleCloseAddMoreDialog} />
            </Dialog>
        </div>
    );
};

export default ReviewForm;
