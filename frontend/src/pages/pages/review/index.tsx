import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button } from '@mui/material';
import { handleFetchData, handleGetSignatureForUpload, handleUploadBackendService, handleUploadCloudService } from 'src/services/userServices';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'src/app/hooks';
import { updateFileList } from 'src/app/redux/slices/fileSlice';

const ReviewPage = () => {
    const router = useRouter();
    const [images, setImages] = useState<File[]>([])
    const [videos, setVideos] = useState<File[]>([])
    const [reviewFiles, setReviewFiles] = useState<{ type: string; url: string }[]>([]);
    const [titles, setTitles] = useState<string>('');
    const [descriptions, setDescriptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.loginState.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchFiles = async () => {
            const { images, videos } = router.query;

            if (images || videos) {
                const imageUrls = images && Array.isArray(images) ? images : [images];
                const videoUrls = videos && Array.isArray(videos) ? videos : [videos];

                try {
                    const imagePreview = imageUrls ? imageUrls.filter((url): url is string => url !== undefined).map((url: string) => ({ type: 'image', url })) : [];
                    const videoPreview = videoUrls ? videoUrls.filter((url): url is string => url !== undefined).map((url: string) => ({ type: 'video', url })) : [];

                    const allFiles = [...imagePreview, ...videoPreview];
                    setReviewFiles(allFiles);

                    const loadImageFiles = async () => {
                        const imagePromises = imageUrls.map(async (url) => {
                            if (url) { // Kiểm tra nếu url không phải là undefined
                                const response = await fetch(url);
                                const blob = await response.blob();

                                return new File([blob], `image_${Date.now()}.jpg`, { type: "image/jpeg" });
                            }

                            return null;
                        });
                        const imageFiles = (await Promise.all(imagePromises)).filter(file => file !== null) as File[];

                        return imageFiles;
                    };

                    const loadVideoFiles = async () => {
                        const videoPromises = videoUrls.map(async (url) => {
                            if (url) { // Kiểm tra nếu url không phải là undefined
                                const response = await fetch(url);
                                const blob = await response.blob();

                                return new File([blob], `video_${Date.now()}.mp4`, { type: "video/mp4" });
                            }

                            return null;
                        });
                        const videoFiles = (await Promise.all(videoPromises)).filter(file => file !== null) as File[];

                        return videoFiles;
                    };

                    const imageUpload = await loadImageFiles();
                    const videoUpload = await loadVideoFiles();

                    setImages(imageUpload);
                    setVideos(videoUpload);
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            }
        };

        fetchFiles();
    }, [router.query]);

    const handleTitleChange = (value: string) => {
        setTitles(value);
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

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

        try {
            setLoading(true);

            //Get signature for Image upload
            const { timestamp: imageTimestamp, signature: imageSignature } = await getSignatureForUpload('images');

            //Get signature for Video upload
            const { timestamp: videoTimestamp, signature: videoSignature } = await getSignatureForUpload('videos');

            //Upload image file
            const imageUrl = await uploadFile('image', imageTimestamp, imageSignature, images);
            console.log('imageUrl: ', imageUrl);

            //Upload video file
            const videoUrl = await uploadFile('video', videoTimestamp, videoSignature, videos);
            console.log('videoUrl: ', videoUrl);

            const username = user?.username;

            if (!!username) {
                //Send backend api request
                const response = await handleUploadBackendService(username, imageUrl, videoUrl, titles, descriptions);
                console.log(response);
            }

            //Reset states
            setImages([]);
            setVideos([]);
            setTitles('');
            setDescriptions([]);

            console.log("File Upload success!");

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

                {reviewFiles.map((file, index) => (
                    <div key={index} className='file-item'>

                        <div className='image-container'>
                            {file.type.includes('video') ? (
                                <video controls>
                                    <source src={file.url} type='video/mp4' />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={file.url} alt={`Uploaded File ${index + 1}`} className='file-image' />
                            )}
                        </div>
                        <div className='description-container'>
                            <input
                                placeholder='Add description'
                                value={descriptions[index]}
                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                className='description-input'
                            />
                        </div>
                    </div>

                ))}
                <Button
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        marginLeft: '170px',
                        '&:hover': {
                            backgroundColor: 'darkgreen',
                        },
                    }}
                    onClick={handleAddImages} className='add-images-button'>
                    <span>+</span> Add Images
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
        </div>
    );
};

export default ReviewPage;
