import { Button, Input } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { Image, Video } from "src/app/redux/slices/fileSlice";
import { updateData } from "src/services/fileServices";

const ViewForm = (props: { data: string | string[] }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { data } = props

    const fileView = useSelector((state) => state.indexedDB.fileListState.fileView);
    const user = useSelector((state) => state.localStorage.userInfoState.userInfo);

    const [file, setFile] = useState<Image | Video | null>(null)
    const [title, setTitle] = useState("")
    const [des, setDes] = useState("")
    const [tagList, setTagList] = useState<string[]>([])
    const [tagNull, setTagNull] = useState(false);

    useEffect(() => {
        if (fileView && fileView.file) {
            setFile(fileView.file);
            setTitle(fileView.title);
            setDes(fileView.file.description);
            setTagList(fileView.tagList);
        }
    }, [data, fileView])

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
            if (user) {
                const res = await updateData(user.username, data[0], data[1], title, des, tagList);
                console.log('res: ', res);
            }
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
                    {!!file && (
                        <div className='image-container'>
                            {
                                data[0] === 'image' && file && 'imageUrl' in file
                                    ? (<img src={file.imageUrl} alt={`View Image File ${data[1]}`} className='file-image' />)
                                    : data[0] === 'video' && file && 'videoUrl' in file
                                        ? (<video controls className="file-video" >
                                            <source src={file.videoUrl} type="video/mp4" />
                                        </video>)
                                        : null
                            }
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