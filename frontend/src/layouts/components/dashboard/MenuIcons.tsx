import { faChevronRight, faDownload, faEdit, faEllipsisVertical, faHeart, faLink, faPaperclip, faShareNodes, faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "src/app/hooks";
import { Image, Video, setClickNumImage, setClickNumVideo, setFavoriteImage, setFavoriteVideo } from "src/app/redux/slices/fileSlice";
import { clickIncrease, setFavoriteFile } from "src/services/fileServices";
import DeleteDialog from "./DeleteDialog";

const MenuIcons = (props: { media: Image | Video, menuType: string }) => {
    const { media, menuType } = props;

    const dispatch = useDispatch();
    const router = useRouter();

    const [base64Code, setBase64Code] = useState<string | undefined>("");
    const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);
    const [subAnchorEl, setSubAnchorEl] = useState<(EventTarget & Element) | null>(null);
    const [copyMes, setCopyMes] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const getBase64Code = () => {
            if ('base64CodeImage' in media) {
                return media.base64CodeImage;
            } else if ('base64CodeVideo' in media) {
                return media.base64CodeVideo;
            }
        }

        const base64Code = getBase64Code();
        setBase64Code(base64Code);
    }, [media])

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewFileOnMenu = async () => {
        if (menuType === 'image') {
            dispatch(setClickNumImage({ fileId: media?._id }));
            router.push(`/view/${menuType}/${media?._id}`);

            await clickIncrease(menuType, media?._id);
        } else {
            dispatch(setClickNumVideo({ fileId: media?._id }));
            router.push(`/view/${menuType}/${media?._id}`);

            await clickIncrease(menuType, media?._id);
        }
    }

    const handleEditImage = async () => {
        dispatch(setClickNumImage({ fileId: media?._id }));
        router.push(`/edit/${menuType}/${media?._id}`)

        await clickIncrease(menuType, media?._id);
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

    const handleClickToCopy = async () => {
        try {
            if (base64Code) {
                await navigator.clipboard.writeText(base64Code);
                setCopyMes(true);
                handleSubMenuClose();
                handleMenuClose();
            }
        } catch (err) {
            console.error('failed to copy: ', err);
        }
    }

    const handleOpenDeleteDialog = () => {
        setConfirmDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleSetFavoriteFile = async () => {
        if (menuType === 'image') {
            dispatch(setFavoriteImage({ fileId: media._id }))
            await setFavoriteFile(menuType, media._id);
        } else {
            dispatch(setFavoriteVideo({ fileId: media._id }))
            await setFavoriteFile(menuType, media._id);
        }
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: 0, left: 0, paddingTop: '10px', zIndex: 1 }}>
                <div className='icon-container'>
                    <FontAwesomeIcon
                        icon={faHeart}
                        className={`heart-icon ${media.isFavorite ? 'heart-active' : ''}`}
                        onClick={handleSetFavoriteFile}
                    />
                </div>
            </div>

            <div style={{ position: 'absolute', top: 0, right: 0, paddingTop: '10px', zIndex: 1 }}>
                <div className='icon-container'>
                    <FontAwesomeIcon
                        icon={faLink}
                        className="copy-link-icon"
                        onClick={handleClickToCopy}
                        onMouseLeave={() => setCopyMes(false)}
                    />
                    <div className='mes'>
                        {!copyMes ? " Copy Link" : "Copied!"}
                    </div>
                </div>
                <div className='icon-container'>
                    <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        aria-haspopup="true"
                        className="menu-icon"
                        onClick={handleMenuOpen}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{ '& .MuiMenu-paper': { width: 200, marginTop: 2 } }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem sx={{ p: 0 }} onClick={handleViewFileOnMenu}>
                            <FontAwesomeIcon
                                icon={faUpDownLeftRight}
                                className='icon'
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
                                    className='icon'
                                />
                                Edit
                            </MenuItem>
                        )}
                        <Divider />
                        <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
                            <FontAwesomeIcon
                                icon={faDownload}
                                className='icon'
                            />
                            <a href={base64Code} download style={{ textDecoration: 'none', color: '#534f5a' }}>
                                Download
                            </a>
                        </MenuItem>

                        <MenuItem sx={{ p: 0 }} onClick={handleSubMenuOpen}>
                            <FontAwesomeIcon
                                icon={faShareNodes}
                                className='icon'
                            />
                            Share
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={`icon-right ${Boolean(subAnchorEl) ? 'active' : ''}`}
                            />
                        </MenuItem>
                        <Menu
                            anchorEl={subAnchorEl}
                            open={Boolean(subAnchorEl)}
                            onClose={handleSubMenuClose}
                            sx={{ '& .MuiMenu-paper': { width: 200, marginTop: -10, marginLeft: 1 } }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <MenuItem sx={{ p: 0 }} onClick={handleCopyLink}>
                                <FontAwesomeIcon
                                    icon={faPaperclip}
                                    className='icon'
                                />
                                Public link
                            </MenuItem>
                            <MenuItem sx={{ p: 0 }} onClick={handleClickToCopy}>
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className='icon'
                                />
                                Copy URL
                            </MenuItem>
                        </Menu>
                        <Divider />
                        <MenuItem sx={{ p: 0 }} onClick={handleOpenDeleteDialog}>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className='icon'
                            />
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {confirmDeleteDialogOpen && (
                <DeleteDialog deleteId={media._id} fileType={menuType} />
            )}
        </div>
    )
}

export default MenuIcons;