import themeConfig from 'src/configs/themeConfig'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { FileList, Image, Video, deleteFile, setClickNumFile, setFileList, setFileView } from 'src/app/redux/slices/fileSlice'

import { clickIncrease, handleFetchData } from 'src/services/fileServices'
import { useRouter } from 'next/router'
import MediaOverlay from 'src/components/common/MediaOverlay'
import MenuIcons from 'src/components/common/MenuIcons'
import styles from '/styles/fileCollection.module.scss'

const FileCollectionsComponent = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const loadingRef = useRef(false);

    const isLoggedIn = useSelector((state) => state.localStorage.userState.isLoggedIn);
    const user = useSelector((state) => state.localStorage.userState.user);

    const { imagesNum, videosNum, fileDelete } = useSelector((state) => state.indexedDB.fileListState);

    const [fileListState, setFileListState] = useState<FileList[]>([]);
    const [page, setPage] = useState(1);
    const [folder, setFolder] = useState("total");
    const [reachedEnd, setReachedEnd] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) router.push("/auth/login");
    }, [])

    const loadMoreFiles = useCallback(async (userId: string, pageNumber: number) => {
        if (!loadingRef.current && !reachedEnd) {
            loadingRef.current = true;
            try {
                const newFileList = await handleFetchData(userId, pageNumber);

                if (!newFileList.data.file[0]) {
                    setReachedEnd(true);
                } else {
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
                    images: fileList.imageIds.filter(image => image._id !== fileDelete.id)
                }));
            } else if (fileDelete.type === 'video') {
                updatedFileList = fileListState.map(fileList => ({
                    ...fileList,
                    videos: fileList.videoIds.filter(video => video._id !== fileDelete.id)
                }));
            }
            setFileListState(updatedFileList);

            dispatch(deleteFile({ type: null, deleteId: null }));
        }
    }, [fileDelete, fileListState])

    const handleViewFile = async (file: Image | Video, fileView: string, title: string, tagList: string[]) => {
        dispatch(setFileView({ file: file, title, tagList }))
        dispatch(setClickNumFile({ fileId: file._id, fileType: fileView }));
        router.push(`/user/view/${fileView}/${file._id}`)

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
                <div className={styles.container}>
                    <div className={styles.content}>
                        {fileListState.length > 0 ? (
                            <div >
                                <div className={styles.folderSelector}>
                                    <label htmlFor="folder">View folder: </label>
                                    <select name="folder" id="folder" onChange={handleChangeFolder}>
                                        <option value="total">Total</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                    <label style={{ marginLeft: 20 }}>{folder === 'total' ? (imagesNum + videosNum) : folder === 'image' ? imagesNum : videosNum} files</label>
                                </div>
                                <div className={styles.containerBox}>
                                    {fileListState?.map((file: FileList, fileIndex: number) => (
                                        <React.Fragment key={fileIndex}>
                                            {(folder === 'total' || folder === 'image') && file?.imageIds?.map((image, imageIndex) => (
                                                <div key={`image-${image._id}`}>
                                                    <div className={styles.imageContainer}>
                                                        <div onClick={() => handleViewFile(image, "image", file.title, file.tagList)}>
                                                            <img src={image.imageUrl} alt={`Image ${imageIndex}`} style={{ width: '100%', height: 'auto' }} />
                                                            <MediaOverlay file={file} media={image} />
                                                        </div>
                                                        <MenuIcons file={file} media={image} menuType='image' />
                                                    </div>
                                                </div>
                                            ))}

                                            {(folder === 'total' || folder === 'video') && file?.videoIds?.map((video, videoIndex) => (
                                                <div key={`video-${video._id}`}>
                                                    <div className={styles.videoContainer}>
                                                        <div>
                                                            <video controls style={{ width: '100%', height: 'auto' }}>
                                                                <source src={video.videoUrl} type="video/mp4" />
                                                            </video>
                                                            {/* Video Overlay */}
                                                            <MediaOverlay file={file} media={video} />
                                                        </div>
                                                        <MenuIcons file={file} media={video} menuType='video' />
                                                    </div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {loadingRef.current && !reachedEnd && <p>Loading...</p>}
                            </div>

                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={styles.text}>
                                    <div className={styles.title}>
                                        Welcome to {themeConfig.templateName} 🥳
                                    </div>
                                    <div className={styles.des}>
                                        Let's upload your images and videos to create something amazing
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default FileCollectionsComponent
