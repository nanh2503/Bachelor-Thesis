import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { FileList, setClickNumImage, setClickNumVideo } from "src/app/redux/slices/fileSlice";
import MediaOverlay from "../dashboard/MediaOverlay";
import { useRouter } from "next/router";
import { clickIncrease } from "src/services/fileServices";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import MenuIcons from "../dashboard/MenuIcons";

const FavoriteComponent = () => {
    const { favoriteFile, favorImageNum, favorVideoNum } = useSelector((state) => state.indexedDB.fileListState);

    const dispatch = useDispatch();
    const router = useRouter();

    const [folder, setFolder] = useState("total");

    const handleViewFile = async (id: string, fileView: string) => {
        if (fileView === 'image') {
            dispatch(setClickNumImage({ fileId: id }));
        } else {
            dispatch(setClickNumVideo({ fileId: id }))
        }
        router.push(`/view/${fileView}/${id}`)

        await clickIncrease(fileView, id);
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
                            {favoriteFile.map((file: FileList, fileIndex: number) => (
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

                                                {image.base64CodeImage && (
                                                    <div>
                                                        <div onClick={() => handleViewFile(image._id, "image")}>
                                                            <img src={image.base64CodeImage} alt={`Image ${imageIndex}`} style={{ width: '100%' }} />
                                                            <MediaOverlay file={file} media={image} />
                                                        </div>

                                                        <MenuIcons media={image} menuType='image' />

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
                                                {video.base64CodeVideo && (
                                                    <>
                                                        <div>
                                                            {/* Video */}
                                                            <video controls style={{ width: '100%', height: 'auto' }}>
                                                                <source src={video.base64CodeVideo} type="video/mp4" />
                                                            </video>

                                                            {/* Video Overlay */}
                                                            <MediaOverlay file={file} media={video} />
                                                        </div>

                                                        <MenuIcons media={video} menuType='video' />

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