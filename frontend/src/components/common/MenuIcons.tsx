import { faChevronRight, faDownload, faEdit, faEllipsisVertical, faHeart, faLink, faPaperclip, faShareNodes, faTrash, faUpDownLeftRight, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { FileList, Image, Video, setClickNumFile, setFavoriteFile, setFileView } from "src/app/redux/slices/fileSlice";
import { clickIncrease, setFavoriteFileService } from "src/services/fileServices";
import DeleteDialog from "./DeleteDialog";
import { convertURLCloudToBase64 } from "src/utils/convertToBase64";
import styles from '/styles/icon.module.scss'
import SelectAlbumDialog, { FileItemInterface } from "./SelectAlbumDialog";
import { FavoriteFileList } from "../user/favorite";

const MenuIcons = (props: { file: FileList | FileItemInterface | FavoriteFileList, media: Image | Video | FileItemInterface, menuType: string }) => {
    const { file, media, menuType } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state) => state.localStorage.userState.user)

    const [urlFile, setUrlFile] = useState("");
    const [base64Code, setBase64Code] = useState("");
    const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);
    const [subAnchorEl, setSubAnchorEl] = useState<(EventTarget & Element) | null>(null);
    const [copyMes, setCopyMes] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [showAddToAlbumDialog, setShowAddToAlbumDialog] = useState(false);

    useEffect(() => {
        const getBase64Code = async () => {
            if ('imageUrl' in media) {
                const url = media.imageUrl;
                setUrlFile(url);
                const base64Code = await convertURLCloudToBase64(url);
                setBase64Code(base64Code);
            } else if ('videoUrl' in media) {
                const url = media.videoUrl;
                setUrlFile(url);
                const base64Code = await convertURLCloudToBase64(url);
                setBase64Code(base64Code);
            } else if ('fileUrl' in media) {
                const url = media.fileUrl;
                setUrlFile(url);
                const base64Code = await convertURLCloudToBase64(url);
                setBase64Code(base64Code);
            }
        }

        getBase64Code();

    }, [media])

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewFileOnMenu = async () => {
        if (user && media._id) {
            dispatch(setFileView({ file: media, title: file.title, tagList: file.tagList }));
            dispatch(setClickNumFile({ fileId: media._id, fileType: menuType }));
            router.push(`/view/${menuType}/${media?._id}`);

            await clickIncrease(user._id, menuType, media?._id);
        }
    }

    const handleEditImage = async () => {
        dispatch(setFileView({ file: media }));
        router.push(`/user/edit/${menuType}/${media?._id}`)

        if (user && media._id) {
            dispatch(setClickNumFile({ fileId: media?._id, fileType: menuType }));
            await clickIncrease(user._id, menuType, media?._id);
        }
    }

    const handleMenuOpen = (event: SyntheticEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSubAnchorEl(event?.currentTarget);
    }

    const handleSubMenuClose = () => {
        setSubAnchorEl(null);
    };

    const handleCopyLink = async () => {
        const port = process.env.NEXT_PUBLIC_PORT;
        let link;
        if (menuType === 'image') {
            link = `http://localhost:${port}/view/${menuType}/${media?._id}/`;
        } else {
            link = `http://localhost:${port}/view/${menuType}/${media?._id}/`;
        }

        await navigator.clipboard.writeText(link);
        handleSubMenuClose();
        handleMenuClose();
    }

    const handleClickToCopy = async (text: string) => {
        console.log('text: ', text);
        try {
            await navigator.clipboard.writeText(text);
            setCopyMes(true);
            handleSubMenuClose();
            handleMenuClose();
        } catch (err) {
            console.error('failed to copy: ', err);
        }
    }

    const handleOpenDeleteDialog = () => {
        setConfirmDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleSetFavoriteFile = async () => {
        if (user && media._id) {
            media.isFavorite = !media.isFavorite;
            dispatch(setFavoriteFile({ fileType: menuType, fileId: media._id, isFavor: media.isFavorite ? true : false }))
            await setFavoriteFileService(user._id, menuType, media._id);
        }
    }

    const handleSelectAlbum = () => {
        setShowAddToAlbumDialog(true);
        handleMenuClose();
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: 0, left: 0, paddingTop: '10px', zIndex: 1 }}>
                <div className={styles.iconContainer}>
                    <FontAwesomeIcon
                        icon={faHeart}
                        className={`${styles.heartIcon} ${media.isFavorite ? styles.heartActive : ''}`}
                        onClick={handleSetFavoriteFile}
                    />
                </div>
            </div>

            <div style={{ position: 'absolute', top: 0, right: 0, paddingTop: '10px', zIndex: 1 }}>
                <div className={styles.iconContainer}>
                    <FontAwesomeIcon
                        icon={faLink}
                        className={styles.copyLinkIcon}
                        onClick={() => handleClickToCopy(urlFile)}
                        onMouseLeave={() => setCopyMes(false)}
                    />
                    <div className={styles.mes}>
                        {!copyMes ? " Copy Link" : "Copied!"}
                    </div>
                </div>
                <div className={styles.iconContainer}>
                    <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        aria-haspopup="true"
                        className={styles.menuIcon}
                        onClick={handleMenuOpen}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        classes={{ paper: styles.menu }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem sx={{ p: 0 }} onClick={handleViewFileOnMenu}>
                            <FontAwesomeIcon
                                icon={faUpDownLeftRight}
                                className={styles.icon}
                            />
                            Open
                        </MenuItem>
                        {menuType !== 'video' && (
                            <MenuItem
                                sx={{ p: 0 }}
                                onClick={handleEditImage}
                            >
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className={styles.icon}
                                />
                                Edit
                            </MenuItem>
                        )}
                        <Divider />
                        {media.hasOwnProperty('_id') && (
                            <MenuItem sx={{ p: 0 }} onClick={handleSelectAlbum}>
                                <FontAwesomeIcon
                                    icon={faFolderPlus}
                                    className={styles.icon}
                                />
                                Add to Album
                            </MenuItem>
                        )}
                        <MenuItem sx={{ p: 0 }} onClick={handleSubMenuOpen}>
                            <FontAwesomeIcon
                                icon={faShareNodes}
                                className={styles.icon}
                            />
                            Share
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={`${styles.iconRight} ${Boolean(subAnchorEl) ? styles.active : ''}`}
                            />
                        </MenuItem>
                        <Menu
                            anchorEl={subAnchorEl}
                            open={Boolean(subAnchorEl)}
                            onClose={handleSubMenuClose}
                            classes={{ paper: styles.subMenu }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <MenuItem sx={{ p: 0 }} onClick={handleCopyLink}>
                                <FontAwesomeIcon
                                    icon={faPaperclip}
                                    className={styles.icon}
                                />
                                Public link
                            </MenuItem>
                            <MenuItem sx={{ p: 0 }} onClick={() => handleClickToCopy(base64Code)}>
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className={styles.icon}
                                />
                                Base64 Code
                            </MenuItem>
                        </Menu>
                        <Divider />
                        <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
                            <FontAwesomeIcon
                                icon={faDownload}
                                className={styles.icon}
                            />
                            <a href={base64Code} download style={{ textDecoration: 'none', color: '#534f5a' }}>
                                Download
                            </a>
                        </MenuItem>
                        <MenuItem sx={{ p: 0 }} onClick={handleOpenDeleteDialog}>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className={styles.icon}
                            />
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {showAddToAlbumDialog && (
                <SelectAlbumDialog
                    onClose={() => setShowAddToAlbumDialog(false)}
                    media={media}
                    file={file}
                />
            )}

            {confirmDeleteDialogOpen && media._id && (
                <DeleteDialog
                    deleteId={media._id}
                    fileType={menuType}
                    deleteType="file"
                />
            )}
        </div>
    )
}

export default MenuIcons;