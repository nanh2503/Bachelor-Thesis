import { Button, Input } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "src/app/hooks";
import { Image, Video } from "src/app/redux/slices/fileSlice";
import { FileItemInterface } from "src/components/common/SelectAlbumDialog";
import { updateData } from "src/services/fileServices";
import styles from '/styles/fileView.module.scss';

const ViewForm = (props: { data: string | string[] }) => {
    const router = useRouter();

    const { data } = props

    const fileView = useSelector((state) => state.indexedDB.fileListState.fileView);
    const user = useSelector((state) => state.localStorage.userState.user);

    const [file, setFile] = useState<Image | Video | FileItemInterface | null>(null)
    const [title, setTitle] = useState("")
    const [des, setDes] = useState("")
    const [tagList, setTagList] = useState<string[]>([])
    const [tagNull, setTagNull] = useState(false);

    useEffect(() => {
        if (fileView) {
            console.log('fileView: ', fileView);
            if (fileView.file) {
                setFile(fileView.file);
                setDes(fileView.file.description);
            }
            if (fileView.title)
                setTitle(fileView.title);
            if (fileView.tagList)
                setTagList(fileView.tagList);
        }
    }, [data, fileView])

    useEffect(() => {
        const setTagListView = () => {
            const tagElements = document.querySelectorAll(`.${styles['tag-view']}`);

            tagElements.forEach(tag => {
                const closeButton = document.createElement('button');
                closeButton.textContent = 'x';
                closeButton.classList.add(styles['close-button']);

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
                const res = await updateData(user._id, data[0], data[1], title, des, tagList);
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
        <div className={styles['container']}>
            <div className={styles['view-file']}>
                <div className={styles['header']}>View File</div>
                <div className={styles['title-container']}>
                    <Input
                        type='text'
                        placeholder='Enter title'
                        style={{ fontWeight: 800, fontSize: '30px' }}
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                    />
                </div>

                <div className={styles['file-item']}>
                    {!!file && (
                        <div className={styles['file-container']}>
                            {data[0] === 'image' && file && 'imageUrl' in file ? (
                                <img src={file.imageUrl} alt={`View Image File ${data[1]}`} className={styles['file-content']} />
                            ) : data[0] === 'video' && file && 'videoUrl' in file ? (
                                <video controls className={styles['file-content']}>
                                    <source src={file.videoUrl} type='video/mp4' />
                                </video>
                            ) : data[0] === 'image' && file && 'fileUrl' in file ? (
                                <img src={file.fileUrl} alt={`View Image File ${data[1]}`} className={styles['file-content']} />
                            ) : null}
                            <div className={styles['description-container']}>
                                <input
                                    placeholder='Add description'
                                    value={des}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                    className={styles['description-input']}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles['block-right']}>
                        <div className={styles['add-tags-block']}>
                            <div className={styles['title']}>ADD TAGS</div>
                            <div className={styles['tags']}>
                                {tagList.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={styles['tag-view']}
                                        contentEditable='true'
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        {tag}
                                    </span>
                                ))}
                                <span
                                    className={styles['tag-input']}
                                    contentEditable='true'
                                    onClick={() => setTagNull(true)}
                                    onBlur={() => setTagNull(false)}
                                    onKeyPress={handleSaveTags}
                                >
                                    {!tagNull ? '✚ Tag' : ''}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveChanges}
                            className={styles['save-changes-button']}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewForm