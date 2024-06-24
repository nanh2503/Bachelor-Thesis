// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Card, CardContent, Typography } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { FileList, Image, Video, deleteFile, setClickNumFile, setFileList, setFileView } from 'src/app/redux/slices/fileSlice'

import { clickIncrease, handleFetchData } from 'src/services/fileServices'
import { useRouter } from 'next/router'
import MediaOverlay from 'src/layouts/components/dashboard/MediaOverlay'
import MenuIcons from 'src/layouts/components/dashboard/MenuIcons'

const ShowFileListComponent = (props: { _id: string }) => {
    const { _id } = props;
    console.log('check _id: ', _id);

    const dispatch = useDispatch();
    const router = useRouter();

    const loadingRef = useRef(false);

    const { user, isLoggedIn } = useSelector((state) => state.localStorage.userState);
    const { imagesNum, videosNum, fileDelete } = useSelector((state) => state.indexedDB.fileListState);

    const [fileListState, setFileListState] = useState<FileList[]>([]);
    const [page, setPage] = useState(1);
    const [folder, setFolder] = useState("total");
    const [reachedEnd, setReachedEnd] = useState(false);

    const loadMoreFiles = useCallback(async (userId: string, pageNumber: number) => {
        if (!loadingRef.current && !reachedEnd) {
            loadingRef.current = true;
            try {
                const newFileList = await handleFetchData(userId, pageNumber);

                if (!newFileList.data.file[0]) {
                    setReachedEnd(true);
                } else {
                    console.log('check fileList: ', newFileList.data.file[0]);

                    const { fileList, imagesNum, videosNum } = newFileList.data.file[0];

                    if (pageNumber === 1) {
                        dispatch(setFileList({ imagesNum, videosNum }));
                    }

                    if (fileList && fileList.length > 0) {
                        setFileListState(prevState => ([...prevState, ...fileList]))
                    } else {
                        setReachedEnd(true);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                loadingRef.current = false;
            }
        }
    }, [reachedEnd]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!loadingRef.current && !reachedEnd && user) {
                loadMoreFiles(user._id, page);
                setPage(page + 1);
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, [user, page, loadMoreFiles, reachedEnd]);

    useEffect(() => {
        if (fileDelete && fileDelete.id) {
            let updatedFileList = [...fileListState];

            if (fileDelete.type === 'image') {
                updatedFileList = fileListState.map(fileList => ({
                    ...fileList,
                    images: fileList.images.filter(image => image._id !== fileDelete.id)
                }));
            } else if (fileDelete.type === 'video') {
                updatedFileList = fileListState.map(fileList => ({
                    ...fileList,
                    videos: fileList.videos.filter(video => video._id !== fileDelete.id)
                }));
            }
            setFileListState(updatedFileList);

            dispatch(deleteFile({ type: null, deleteId: null }));
        }
    }, [fileDelete, fileListState])

    const handleViewFile = async (file: Image | Video, fileView: string, title: string, tagList: string[]) => {
        dispatch(setFileView({ file: file, title, tagList }))
        dispatch(setClickNumFile({ fileId: file._id, fileType: fileView }));
        router.push(`/view/${fileView}/${file._id}`)

        if (user) {
            await clickIncrease(user._id, fileView, file._id);
        }
    }

    const handleChangeFolder = (event: ChangeEvent<HTMLSelectElement>) => {
        setFolder(event.target.value);
    }

    return (
        <>
            {isLoggedIn && (
                <ApexChartWrapper>
                    <Card sx={{ position: 'relative', height: '100%' }}>
                        <CardContent>
                            <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
                                Welcome to {themeConfig.templateName} 🥳
                            </Typography>

                            {fileListState.length > 0 ? (
                                <div>
                                    <div className="folder-selector">
                                        <label htmlFor="folder">View folder: </label>
                                        <select name="folder" id="folder" onChange={handleChangeFolder}>
                                            <option value="total">Total</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                        <label style={{ marginLeft: 20 }}>{folder === 'total' ? (imagesNum + videosNum) : folder === 'image' ? imagesNum : videosNum} files</label>
                                    </div>
                                    <div className='container-box'>
                                        {fileListState?.map((file: FileList, fileIndex: number) => (
                                            <React.Fragment key={fileIndex}>
                                                {(folder === 'total' || folder === 'image') && file.images.map((image, imageIndex) => (
                                                    <div key={`image-${imageIndex}`} >
                                                        <div
                                                            style={{
                                                                marginBottom: '20px',
                                                                breakInside: 'avoid',
                                                                position: 'relative',
                                                                overflow: 'hidden',
                                                                borderRadius: '15px',
                                                                border: '3px solid transparent',
                                                                backgroundImage: 'linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {image.imageUrl && (
                                                                <div >
                                                                    <div onClick={() => handleViewFile(image, "image", file.title, file.tagList)} >
                                                                        {/* Image */}
                                                                        <img src={image.imageUrl} alt={`Image ${imageIndex}`} style={{ width: '100%', height: 'auto' }} />
                                                                        {/* Image Overlay */}
                                                                        <MediaOverlay file={file} media={image} />
                                                                    </div>

                                                                    <MenuIcons file={file} media={image} menuType='image' />

                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {(folder === 'total' || folder === 'video') && file.videos.map((video, videoIndex) => (
                                                    <div key={`video-${videoIndex}`}>
                                                        <div
                                                            style={{
                                                                marginBottom: '20px',
                                                                breakInside: 'avoid',
                                                                position: 'relative',
                                                                overflow: 'hidden',
                                                                borderRadius: '15px',
                                                                border: '3px solid transparent',
                                                                backgroundImage: 'linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {video.videoUrl && (
                                                                <>
                                                                    <div>
                                                                        {/* Video */}
                                                                        <video controls style={{ width: '100%', height: 'auto' }}>
                                                                            <source src={video.videoUrl} type="video/mp4" />
                                                                        </video>

                                                                        {/* Video Overlay */}
                                                                        <MediaOverlay file={file} media={video} />
                                                                    </div>

                                                                    <MenuIcons file={file} media={video} menuType='video' />

                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    {loadingRef.current && !reachedEnd && <p>Loading...</p>}
                                </div>

                            ) : (
                                <div style={{ textAlign: 'center', marginTop: -50, marginBottom: 120, fontSize: 18 }}>
                                    Let's upload your images and videos to create something amazing
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ApexChartWrapper>
            )}
        </>
    )
}

export default ShowFileListComponent
