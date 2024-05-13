import { Button, Input } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { Image, Video, updateImage, updateVideo } from "src/app/redux/slices/fileSlice";
import { updateData } from "src/services/fileServices";

const ViewForm = (props: { data: string | string[] }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { data } = props

    const fileList = useSelector((state) => state.fileListState.file)

    const [image, setImage] = useState<Image | null>(null)
    const [video, setVideo] = useState<Video | null>(null)
    const [title, setTitle] = useState("")
    const [des, setDes] = useState("")
    const [tagList, setTagList] = useState<string[]>([])

    useEffect(() => {
        const getFile = () => {
            fileList.map((file) => {
                if (data[0] === 'image' && file.images.some(image => image._id === data[1])) {
                    file.images.map((image) => {
                        if (image._id === data[1]) {
                            setImage(image);
                            setDes(image.description);
                        }
                        setTitle(file.title);
                        setTagList(file.tagList);
                    })
                } else if (data[0] === 'video' && file.videos.some(video => video._id === data[1])) {
                    file.videos.map(video => {
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

    const handleTitleChange = (value: string) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDes(value);
    };

    const handleEditTags = (event: React.KeyboardEvent<HTMLSpanElement>, index: number) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const inputElement = event.target as HTMLSpanElement;
            if (!!inputElement) {
                const editTag = inputElement.innerHTML.trim();
                const tagEditedList = [...tagList];
                tagEditedList[index] = editTag;
                setTagList(tagEditedList);
            }
        }
    }

    const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            if (data[0] === 'image') {
                dispatch(updateImage({ editId: data[1], editTitle: title, editDescription: des, editTagList: tagList }))
            } else {
                dispatch(updateVideo({ editId: data[1], editTitle: title, editDescription: des, editTagList: tagList }))
            }

            await updateData(data[1], title, des);
        } catch (error) {
            console.error('Error during save:', error);
        }

        router.push("/");
    }

    return (
        <div className='container'>
            <div >
                <h1 style={{ justifyContent: 'left' }}>View File</h1>
                <div className='title-container'>
                    <Input
                        type='text'
                        placeholder='Enter title'
                        style={{ fontWeight: 800, fontSize: '30px' }}
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                    />
                </div>

                <div className='file-item'>
                    {!!image && (
                        <div className='image-container'>
                            <img src={image.imageUrl} alt={`View Image File ${data[1]}`} className='file-image' />
                            <div className='description-container'>
                                <input
                                    placeholder='Add description'
                                    value={des}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                    className='description-input'
                                />
                            </div>
                        </div>
                    )}

                    {!!video && (
                        <div className="video-container">
                            <video controls className="file-video" >
                                <source src={video.videoUrl} type="video/mp4" />
                            </video>
                            <div className="description-container">
                                <input
                                    placeholder="Add description"
                                    value={des}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                    className="description-input"
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
                            contentEditable="true"
                            onKeyPress={(event) => handleEditTags(event, index)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <Button
                    sx={{
                        backgroundColor: '#CC6600',
                        padding: '10px 30px',
                        color: 'white',
                        marginLeft: '150px',
                        borderRadius: '30px',
                        marginTop: '30px',

                        '&:hover': {
                            backgroundColor: '#FF7F50',
                        },
                    }}
                    onClick={handleSaveChanges} className='save-changes-button'>
                    Save Changes
                </Button>

            </div>
        </div>
    );
}

export default ViewForm