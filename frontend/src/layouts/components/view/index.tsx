import { Button, Input } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { FileList, Image, Video, updateImage, updateVideo } from "src/app/redux/slices/fileSlice";
import { updateData } from "src/services/fileServices";

const ViewForm = (props: { data: string | string[] }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { data } = props

    const fileList = useSelector((state) => state.indexedDB.fileListState.file)

    const [image, setImage] = useState<Image | null>(null)
    const [video, setVideo] = useState<Video | null>(null)
    const [title, setTitle] = useState("")
    const [des, setDes] = useState("")
    const [tagList, setTagList] = useState<string[]>([])
    const [tagNull, setTagNull] = useState(false);

    useEffect(() => {
        const getFile = () => {
            fileList.map((file: FileList) => {
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
    }, [data, fileList])

    useEffect(() => {
        const setTagListView = () => {
            const tagElements = document.querySelectorAll('.tags-view');

            tagElements.forEach(tag => {
                const closeButton = document.createElement('button');
                closeButton.textContent = 'x';
                closeButton.classList.add('close-button');

                tag.addEventListener('mouseenter', () => {
                    tag.appendChild(closeButton)
                })

                tag.addEventListener('mouseleave', () => {
                    if (tag.contains(closeButton)) {
                        tag.removeChild(closeButton)
                    }
                })
            })
        }
        setTagListView();
    }, [tagList])

    const handleTitleChange = (value: string) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDes(value);
    };

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

    const handleSaveTags: React.KeyboardEventHandler<HTMLSpanElement> = (event) => {
        if (event.key === 'Enter') {
            const inputElement = event.target as HTMLSpanElement;
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
                    }
                }
                inputElement.innerText = '✚ Tag';

                event.preventDefault();

                inputElement.blur();
            }
        }
    }

    const handleRemoveTag = (tag: string) => {
        const updateTagList = tagList.filter(newTag => newTag !== tag)
        setTagList(updateTagList);
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
                            className="tags-view"
                            contentEditable="true"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag}
                        </span>
                    ))}
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