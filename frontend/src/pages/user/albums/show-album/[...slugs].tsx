import { useRouter } from "next/router"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { FileItemInterface } from "src/components/common/SelectAlbumDialog";
import { handleViewFileInAlbumService } from "src/services/albumServices";
import styles from '/styles/albumViewFile.module.scss'
import MediaOverlay from "src/components/common/MediaOverlay";
import MenuIcons from "src/components/common/MenuIcons";
import { setClickNumFile, setFileView } from "src/app/redux/slices/fileSlice";
import { clickIncrease } from "src/services/fileServices";

const ShowAlbumPage = () => {
    const router = useRouter();
    const data = router.query.slugs;
    const dispatch = useDispatch();

    const user = useSelector((state) => state.localStorage.userState.user);

    const [listFile, setListFile] = useState<FileItemInterface[]>([]);

    useEffect(() => {
        const getFiles = async () => {
            if (data && user) {
                try {
                    const res = await handleViewFileInAlbumService(user._id, data[0]);
                    console.log('check res data: ', res.data.file);
                    const files = res.data.file;
                    setListFile(files);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        getFiles();
    }, [])

    const isImage = (url: string) => {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    };

    const handleViewFile = async (file: FileItemInterface, fileView: string, title: string, tagList: string[]) => {
        dispatch(setFileView({ file: file, title, tagList }))
        router.push(`/user/view/${fileView}/${file._id}`)

        if (user && file._id) {
            dispatch(setClickNumFile({ fileId: file._id, fileType: fileView }));
            await clickIncrease(user._id, fileView, file._id);
        }
    }

    return (
        <div>
            <h1>Show album {data && data[0]}</h1>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.containerBox}>
                        {listFile?.map((file, fileIndex) => (
                            <div key={file._id} className={styles.fileContainer}>
                                {isImage(file.fileUrl) ? (
                                    <div onClick={() => handleViewFile(file, "image", file.title, file.tagList)}>
                                        <img src={file.fileUrl} alt={`Image ${fileIndex}`} style={{ width: '100%', height: 'auto' }} />
                                        <MediaOverlay file={file} media={file} />
                                    </div>
                                ) : (
                                    <div>
                                        <video controls style={{ width: '100%', height: 'auto' }}>
                                            <source src={file.fileUrl} type="video/mp4" />
                                        </video>
                                        <MediaOverlay file={file} media={file} />
                                    </div>
                                )}
                                <MenuIcons file={file} media={file} menuType={isImage(file.fileUrl) ? 'image' : 'video'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowAlbumPage;