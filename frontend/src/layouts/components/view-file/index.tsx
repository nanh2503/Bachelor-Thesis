import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "src/app/hooks";
import { Image, Video } from "src/app/redux/slices/fileSlice";

const ViewFileForm = (props: { data: string | string[] }) => {

    const { data } = props;

    const fileList = useSelector((state) => state.fileListState.file)

    const [image, setImage] = useState<Image | null>(null)
    const [video, setVideo] = useState<Video | null>(null)
    const [title, setTitle] = useState("")
    const [des, setDes] = useState("")
    const [tagList, setTagList] = useState<string[]>([])

    useEffect(() => {
        const getFile = () => {
            fileList?.map((file) => {
                if (data[0] === 'image' && file.images.some((image) => image._id === data[1])) {
                    file.images.map((image) => {
                        if (image._id === data[1]) {
                            setImage(image);
                            setDes(image.description);
                        }
                        setTitle(file.title);
                        setTagList(file.tagList);
                    })
                } else if (data[0] === 'video' && file.videos.some((video) => video._id === data[1])) {
                    file.videos.map((video) => {
                        if (video._id === data[1]) {
                            setVideo(video);
                            setDes(video.description);
                        }
                        setTitle(file.title);
                        setTagList(file.tagList);
                    })
                }
            })
        }

        getFile();
    }, [data])

    return (
        <div className="container">
            <div>
                <div className="title-container">
                    <Input
                        type='text'
                        style={{ fontWeight: 800, fontSize: '30px' }}
                        value={title}
                        disabled
                    />
                </div>
                <div className="file-item">
                    {!!image && (
                        <div className="image-container">
                            <img src={image.imageUrl} alt={`View Image File ${data[1]}`} className="file-image" />
                            <div className="description-container">
                                <input
                                    value={des}
                                    className='description-input'
                                    disabled
                                />
                            </div>
                        </div>
                    )}

                    {!!video && (
                        <div className="video-container" >
                            <video controls className="file-video">
                                <source src={video.videoUrl} type="video/mp4" />
                            </video>
                            <div className="description-container">
                                <input
                                    value={des}
                                    className='description-input'
                                    disabled
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="tags" >
                    {tagList.map((tag, index) => (
                        <span
                            key={index}
                            className="tags-input"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ViewFileForm