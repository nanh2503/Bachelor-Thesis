import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Dialog } from '@mui/material';
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
    const [tagNull, setTagNull] = useState(false);
    const [tagList, setTagList] = useState<string[]>([]);

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

    const convertURLToFile = async (url: string) => {
        try {
            const corsImageModified = new Image();
            corsImageModified.crossOrigin = "Anonymous";
            corsImageModified.src = url + "?not-from-cache-please";
            await new Promise((resolve, reject) => {
                corsImageModified.onload = resolve;
                corsImageModified.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = corsImageModified.width;
            canvas.height = corsImageModified.height;
            if (!!context) {
                context.drawImage(corsImageModified, 0, 0);
            }

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!!blob) {
                        const file = new File([blob], `image_${Date.now()}.jpg`, { type: blob.type });
                        resolve(file);
                    } else {
                        reject(new Error('Blob is null'));
                    }
                });
            });
        } catch (e) {
            console.error('Error converting URL to file:', e);
        }
    }

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

            const uploadPromises = files.map(async (file) => {
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
            for (const image of imagesReview) {
                if (image.startsWith('http')) {
                    const imageUrl = await convertURLToFile(image);
                    imageFiles.push(imageUrl);
                } else {
                    const imageFile = base64ToFileImage(image);
                    imageFiles.push(imageFile);
                }
            }
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

            const base64Code = [...imagesReview]

            if (!!username) {
                //Send backend api request
                await handleUploadBackendService(username, imageUrl, videoUrl, titles, descriptions, base64Code, tagList);
            }


            const newFile = await fetchNewestData('newest')
            dispatch(updateFileList(newFile))

            setLoading(false);
            router.push("/")
        } catch (error) {
            console.error(error);
        }
    }

    const handleSaveTags: React.KeyboardEventHandler<HTMLSpanElement> = (event) => {
        if (event.key === 'Enter') {
            const inputElement = event.target as HTMLElement;
            if (!!inputElement && !!inputElement.parentNode) {
                const newTag = inputElement.innerText.trim();

                if (newTag !== '') {
                    let existTag = false;
                    tagList.map(tag => {
                        if (tag === newTag) {
                            existTag = true;

                            return;
                        }
                    })

                    if (!existTag) {
                        setTagList([...tagList, newTag]);
                        const tagElement = document.createElement('span');
                        tagElement.textContent = newTag;
                        tagElement.classList.add('tags-input');

                        //Tạo nút x để xóa tag
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'x';
                        closeButton.classList.add('close-button');

                        //Xử lý sự kiện click vào nút x để xóa tag
                        closeButton.addEventListener('click', () => {
                            tagElement.parentNode?.removeChild(tagElement);
                            const updatedTagList = tagList.filter(tag => tag !== newTag);
                            setTagList(updatedTagList);
                        })

                        tagElement.addEventListener('click', () => {
                            tagElement.parentNode?.removeChild(tagElement);
                            const updatedTagList = tagList.filter(tag => tag !== newTag);
                            setTagList(updatedTagList);
                        })

                        //Hiển thị nút x khi hover vào thẻ tag
                        tagElement.addEventListener('mouseenter', () => {
                            tagElement.appendChild(closeButton);
                        })

                        //Loại bỏ nút x khi rời thẻ tag
                        tagElement.addEventListener('mouseleave', () => {
                            tagElement.removeChild(closeButton);
                        })

                        inputElement.parentNode.insertBefore(tagElement, inputElement);
                    }
                    inputElement.innerText = '✚ Tag';

                    event.preventDefault();

                    inputElement.blur();
                }
            }
        }
    }

    return (
        <div>
            <h1>Review Uploaded Files</h1>
            <div className='container'>
                <div className='container-left'>
                    <div className='title-container'>
                        <Input
                            type='text'
                            placeholder='Enter title'
                            style={{ fontWeight: 800, fontSize: '30px' }}
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
                            backgroundColor: '#FF6699',
                            padding: '10px 40px',
                            color: 'white',
                            transformX: '-30%',
                            left: '30%',
                            borderRadius: '30px',
                            fontWeight: 700,
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: '#FF6666',
                            },
                        }}
                        onClick={handleOpenAddMoreDialog} className='add-images-button'>
                        ✚ Add Files
                    </Button>

                </div>

                <div className='container-right'>
                    <div className='post-button'>
                        <div style={{ fontWeight: 1000, fontSize: 22 }}>POST</div>
                        <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
                            <Button
                                sx={{
                                    backgroundColor: 'green',
                                    padding: '20px 50px',
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: 'limegreen',
                                    },
                                }}
                                onClick={handleAddImages}
                            >To Community</Button>

                            <Button
                                sx={{
                                    backgroundColor: 'gray',
                                    padding: '20px 50px',
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#CC9900',
                                    },
                                }}

                            >Share Post</Button>
                        </div>
                    </div>

                    <div className='add-tag-button'>
                        <div style={{ fontWeight: 1000, fontSize: 22, marginTop: 100 }}>ADD TAGS</div>
                        <div className='tags'>
                            <span
                                className='tags-input'
                                contentEditable="true"
                                onClick={() => setTagNull(true)}
                                onBlur={() => setTagNull(false)}
                                onKeyPress={handleSaveTags}
                            >
                                {!tagNull ? '✚ Tag' : ''}
                            </span>
                        </div>
                    </div>
                </div>
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

export default ReviewForm
