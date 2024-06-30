import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Dialog } from '@mui/material';
import { handleUploadBackendService } from 'src/services/fileServices';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'src/app/hooks';
import UploadForm from '../upload';
import { setTitles, setDescriptions } from 'src/app/redux/slices/uploadFileSlice';
import { convertFileToBase64 } from 'src/utils/convertToBase64';
import { base64ToFileImage, base64ToFileVideo } from 'src/utils/convertBase64ToFile';
import { updateFileList } from 'src/app/redux/slices/fileSlice';
import { getSignatureForUpload, uploadFile } from 'src/utils/uploadFileToCloud';
import styles from '/styles/review.module.scss';

const ReviewForm = () => {
    const user = useSelector((state) => state.localStorage.userState.user)
    const imagesReview = useSelector((state) => state.indexedDB.uploadFileState.imagesReview)
    const videosReview = useSelector((state) => state.indexedDB.uploadFileState.videosReview)
    const titles = useSelector((state) => state.indexedDB.uploadFileState.title)
    const descriptions = useSelector((state) => state.indexedDB.uploadFileState.descriptions)

    const router = useRouter();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);
    const [isAddMoreDialogOpen, setAddMoreDialogOpen] = useState(false);
    const [tagNull, setTagNull] = useState(false);
    const [tagList, setTagList] = useState<string[]>([]);

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

    const handleAddImages = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const imageFiles: File[] = [];
        const videoFiles: File[] = [];

        const base64CodeImage = []
        const base64CodeVideo = []

        if (imagesReview.length > 0) {
            for (const image of imagesReview) {
                if (image.startsWith('http')) {
                    const imageUrl = await convertURLToFile(image) as File;
                    imageFiles.push(imageUrl);
                    const base64Code = await convertFileToBase64(imageUrl)
                    base64CodeImage.push(base64Code);
                } else {
                    const imageFile = base64ToFileImage(image);
                    imageFiles.push(imageFile);
                    base64CodeImage.push(image);
                }
            }
        }

        if (videosReview.length > 0) {
            for (const video of videosReview) {
                const videoFile = base64ToFileVideo(video);
                videoFiles.push(videoFile);
                base64CodeVideo.push(video);
            }
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

            const userId = user?._id;

            if (!!userId) {
                //Send backend api request
                const res = await handleUploadBackendService(userId, imageUrl, videoUrl, titles, descriptions, tagList);
                console.log('res upload: ', res);
            }

            // const newFile = await fetchNewestData('newest')
            dispatch(updateFileList({ imagesNum: imageUrl.length, videosNum: videoUrl.length }))

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
                        tagElement.classList.add(styles.tagsInput);

                        //Tạo nút x để xóa tag
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'x';
                        closeButton.classList.add(styles.closeButton);

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
            <div className={styles.container}>
                <h1>Review Uploaded Files</h1>
                <div className={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={styles.containerLeft}>
                            <div className={styles.titleContainer}>
                                <input
                                    type='text'
                                    placeholder='Give your post a unique title...'
                                    value={titles}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                />
                            </div>

                            <div className={styles.fileItem}>
                                <div className={styles.imageContainer}>
                                    {imagesReview.map((image: string, index: number) => {
                                        return (
                                            <div key={index}>
                                                <img src={image} alt={`Uploaded Image File ${index + 1}`} className={styles.fileImage} />
                                                <div className={styles.descriptionContainer}>
                                                    <input
                                                        placeholder='Add description'
                                                        value={descriptions[index]}
                                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.videoContainer}>
                                    {videosReview.map((video: string, index: number) => {
                                        const indexVideo = index + imagesReview.length;

                                        return (
                                            <div key={indexVideo}>
                                                <video controls>
                                                    <source src={video} type='video/mp4' className={styles.fileVideo} />
                                                </video>
                                                <div className={styles.descriptionContainer}>
                                                    <input
                                                        placeholder='Add a description'
                                                        value={descriptions[indexVideo]}
                                                        onChange={(e) => handleDescriptionChange(indexVideo, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.containerRight}>
                        <div className={styles.postContainer}>
                            <div className={styles.title}>POST</div>
                            <div className={styles.postButton}>
                                <Button
                                    sx={{
                                        backgroundColor: 'green',
                                        '&:hover': {
                                            backgroundColor: 'limegreen',
                                        },
                                    }}
                                    onClick={handleAddImages}
                                >To Community</Button>

                                <Button
                                    sx={{
                                        backgroundColor: 'gray',
                                        '&:hover': {
                                            backgroundColor: '#CC9900',
                                        },
                                    }}

                                >Share Post</Button>
                            </div>
                        </div>

                        <div className={styles.addButton}>
                            <div className={styles.addTagButton}>
                                <div className={styles.title}>ADD TAGS</div>
                                <div className={styles.tags}>
                                    <span
                                        className={styles.tagsInput}
                                        contentEditable="true"
                                        onClick={() => setTagNull(true)}
                                        onBlur={() => setTagNull(false)}
                                        onKeyPress={handleSaveTags}
                                    >
                                        {!tagNull ? '✚ Tag' : ''}
                                    </span>
                                </div>
                            </div>

                            <Button
                                className={styles.addImagesButton}
                                onClick={handleOpenAddMoreDialog}
                            >
                                ✚ Add Files
                            </Button>
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
