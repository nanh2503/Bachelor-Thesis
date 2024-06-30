import { Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Button, ListItemAvatar, Avatar, Radio } from "@mui/material";
import { useEffect, useState } from "react";
import { Album } from "src/pages/user/albums";
import { handleAddFileToAlbumService, handleGetAllAlbumService } from "src/services/albumServices";
import { FileList, Image, Video } from "src/app/redux/slices/fileSlice";
import { useSelector } from "src/app/hooks";

export interface FileItemInterface {
    _id?: string;
    fileUrl: string;
    description: string;
    clickNum: number;
    isFavorite: boolean;
    title: string;
    tagList: string[];
}

type SelectAlbumDialogProps = {
    onClose: () => void;
    onFileAdded?: (albumId: string) => void;
    media: Image | Video | FileItemInterface;
    file: FileList | FileItemInterface
};

const SelectAlbumDialog = ({ onClose, media, file }: SelectAlbumDialogProps) => {

    const user = useSelector((state) => state.localStorage.userState.user);

    const [albums, setAlbums] = useState<Album[]>([]);
    const [isOpen, setOpen] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const selectedFile: FileItemInterface = {
        fileUrl: '',
        description: '',
        clickNum: 0,
        isFavorite: false,
        title: '',
        tagList: []
    }

    useEffect(() => {
        const fetchAlbums = async () => {
            if (user) {
                try {
                    const response = await handleGetAllAlbumService(user._id, 'All');
                    console.log('check response: ', response);
                    const file = response.data.file[0].albumList;
                    setAlbums(file);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchAlbums();
    }, []);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAlbum((event.target as HTMLInputElement).value);
    };

    const handleAddFileToAlbum = async () => {
        console.log('check selectedAlbum: ', selectedAlbum);
        setOpen(false);
        onClose();

        if (selectedAlbum) {
            if ('imageUrl' in media) {
                selectedFile.fileUrl = media.imageUrl
            } else if ('videoUrl' in media) {
                selectedFile.fileUrl = media.videoUrl
            }
            selectedFile.description = media.description;
            selectedFile.clickNum = media.clickNum;
            selectedFile.isFavorite = media.isFavorite;
            selectedFile.tagList = file.tagList;
            selectedFile.title = file.title;

            if (user) {
                try {
                    const res = await handleAddFileToAlbumService(user._id, selectedAlbum, selectedFile);
                    console.log('File added successfully: ', res);
                } catch (error) {
                    console.error('Error adding file to album: ', error);
                }
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Select Album</DialogTitle>
            <DialogContent>
                <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {albums.map((album) => (
                        <ListItem key={album._id} sx={{ width: '50%', minWidth: '200px' }}>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={album.avatarUrl} alt="Album avatar" style={{ width: '100%', height: '100%' }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={album.albumName} />
                            <Radio
                                checked={selectedAlbum === album._id}
                                onChange={handleRadioChange}
                                value={album._id}
                                name="album-radio"
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddFileToAlbum} color="primary" disabled={!selectedAlbum}>
                    Add to Album
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectAlbumDialog;
