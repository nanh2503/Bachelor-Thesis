import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { Image, Video, setClickNumFile, setFavorFileList, setFavoriteFile, setFileView } from 'src/app/redux/slices/fileSlice'

import { clickIncrease, handleGetFavoriteFile } from 'src/services/fileServices'
import { useRouter } from 'next/router'
import MediaOverlay from 'src/components/common/MediaOverlay'
import MenuIcons from 'src/components/common/MenuIcons'
import styles from '/styles/fileCollection.module.scss'

export interface FavoriteFileList {
    _id: string,
    images: Image[],
    videos: Video[],
    title: string,
    tagList: string[]
}

const FavoriteComponent = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const loadingRef = useRef(false);

    const user = useSelector((state) => state.localStorage.userState.user);
    const { favorImageNum, favorVideoNum, fileDisFavor } = useSelector((state) => state.indexedDB.fileListState);

    const [favoriteFileList, setFavoriteFileList] = useState<FavoriteFileList[]>([]);
    const [page, setPage] = useState(1);
    const [folder, setFolder] = useState("total");
    const [reachedEnd, setReachedEnd] = useState(false);

    const loadMoreFiles = useCallback(async (userId: string, pageNumber: number) => {
        if (!loadingRef.current && !reachedEnd) {
            loadingRef.current = true;
            try {
                const newFileList = await handleGetFavoriteFile(userId, pageNumber);
                console.log('check favor fileList: ', newFileList.data);

                if (!newFileList.data) {
                    setReachedEnd(true);
                } else {
                    const fileList = newFileList.data.file;
                    console.log('check fileList: ', fileList);

                    let numOfFavorImage = 0;
                    let numOfFavorVideo = 0;

                    if (fileList && fileList.length > 0) {
                        console.log('oce');
                        setFavoriteFileList(prevState => ([...prevState, ...fileList]));

                        fileList.forEach((file: FavoriteFileList) => {
                            numOfFavorImage += file.images.length;
                            numOfFavorVideo += file.videos.length;
                        });

                        dispatch(setFavorFileList({
                            favorImageNum: numOfFavorImage,
                            favorVideoNum: numOfFavorVideo
                        }));
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
        if (user) {
            const intervalId = setInterval(() => {
                if (!loadingRef.current && !reachedEnd) {
                    loadMoreFiles(user._id, page);
                    setPage(prevPage => prevPage + 1);
                }
            }, 200);

            return () => clearInterval(intervalId);
        }
    }, [user, reachedEnd, loadMoreFiles, page]);

    useEffect(() => {
        if (fileDisFavor && fileDisFavor.id) {
            setFavoriteFileList(prevFavoriteFileList => {
                let updatedFileList = [...prevFavoriteFileList];

                if (fileDisFavor.type === 'image') {
                    updatedFileList = prevFavoriteFileList.map(fileList => ({
                        ...fileList,
                        images: fileList.images.filter(image => image._id !== fileDisFavor.id)
                    }));
                } else if (fileDisFavor.type === 'video') {
                    updatedFileList = prevFavoriteFileList.map(fileList => ({
                        ...fileList,
                        videos: fileList.videos.filter(video => video._id !== fileDisFavor.id)
                    }));
                }

                return updatedFileList;
            });

            dispatch(setFavoriteFile({ fileType: null, fileId: null, isFavor: null }));
        }
    }, [fileDisFavor, dispatch]);

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
            <div className={styles.container}>
                <div className={styles.content}>
                    {favoriteFileList.length > 0 ? (
                        <div >
                            <div className={styles.folderSelector}>
                                <label htmlFor="folder">View folder: </label>
                                <select name="folder" id="folder" onChange={handleChangeFolder}>
                                    <option value="total">Total</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                                <label style={{ marginLeft: 20 }}>{folder === 'total' ? (favorImageNum + favorVideoNum) : folder === 'image' ? favorImageNum : favorVideoNum} files</label>
                            </div>
                            <div className={styles.containerBox}>
                                {favoriteFileList?.map((file: FavoriteFileList, fileIndex: number) => (
                                    <React.Fragment key={fileIndex}>
                                        {(folder === 'total' || folder === 'image') && file?.images?.map((image, imageIndex) => (
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

                                        {(folder === 'total' || folder === 'video') && file?.videos?.map((video, videoIndex) => (
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
                        <div style={{ color: '#000', fontSize: '30px' }}>
                            You do not have any favorite files.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FavoriteComponent
