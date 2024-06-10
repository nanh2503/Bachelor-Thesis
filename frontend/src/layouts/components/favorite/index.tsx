import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { FileList, Image, Video, setClickNumFile, setFavoriteFile, setFileView } from "src/app/redux/slices/fileSlice";
import MediaOverlay from "../dashboard/MediaOverlay";
import { useRouter } from "next/router";
import { clickIncrease, handleGetFavoriteFile } from "src/services/fileServices";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import MenuIcons from "../dashboard/MenuIcons";

const FavoriteComponent = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state) => state.localStorage.userInfoState.userInfo);
    const { favorImageNum, favorVideoNum, fileDisFavor } = useSelector((state) => state.indexedDB.fileListState);

    const [favoriteFileList, setFavoriteFileList] = useState<FileList[]>([]);
    const [page, setPage] = useState(1);
    const [folder, setFolder] = useState("total");
    const loadingRef = useRef(false);
    const [reachedEnd, setReachedEnd] = useState(false);

    const loadMoreFiles = useCallback(async (username: string, pageNumber: number) => {
        if (!loadingRef.current && !reachedEnd) {
            loadingRef.current = true;
            try {
                const newFileList = await handleGetFavoriteFile(username, pageNumber);

                if (!newFileList.data.file[0]) {
                    setReachedEnd(true);
                } else {
                    const fileList = newFileList.data.file[0].fileList;

                    if (fileList && fileList.length > 0) {
                        setFavoriteFileList(prevState => ([...prevState, ...fileList]))
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
                    loadMoreFiles(user.username, page);
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
        router.push(`/view/${fileView}/${file._id}`)

        if (user) {
            await clickIncrease(user.username, fileView, file._id);
        }
    }

    const handleChangeFolder = (event: ChangeEvent<HTMLSelectElement>) => {
        setFolder(event.target.value);
    }

    return (
        <>
            <ApexChartWrapper>
                <Card sx={{ position: 'relative', height: '100%' }}>
                    <CardContent>
                        <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
                            Favorite files
                        </Typography>

                        <div className="folder-selector">
                            <label htmlFor="folder">View folder: </label>
                            <select name="folder" id="folder" onChange={handleChangeFolder}>
                                <option value="total">Total</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                            <label style={{ marginLeft: 20 }}>{folder === 'total' ? (favorImageNum + favorVideoNum) : folder === 'image' ? favorImageNum : favorVideoNum} files</label>
                        </div>

                        <div className="container-box">
                            {favoriteFileList?.map((file: FileList, fileIndex: number) => (
                                <div key={fileIndex}>
                                    {(folder === 'total' || folder === 'image') && file.images.map((image, imageIndex) => (
                                        <div key={imageIndex}>
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
                                                    <div>
                                                        <div onClick={() => handleViewFile(image, "image", file.title, file.tagList)}>
                                                            <img src={image.imageUrl} alt={`Image ${imageIndex}`} style={{ width: '100%' }} />
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
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </ApexChartWrapper>
        </>
    )
}

export default FavoriteComponent;