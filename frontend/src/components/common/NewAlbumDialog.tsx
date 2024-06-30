import styled from 'styled-components';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, PropsWithoutRef, useState } from "react";

interface NewAlbumState {
    avatar: string;
    albumName: string;
    description: string;
}

const StyledDialog = styled(Dialog)`
    .MuiDialogTitle-root {
        background-color: #f0f0f0; /* Example background color */
    }

    .MuiDialogContent-root {
        padding: 20px;
    }

    .MuiDialogActions-root {
        padding: 10px 20px;
        justify-content: flex-end;
    }
`;

const NewAlbumDialog = (props: PropsWithoutRef<{
    isOpen: boolean;
    onClose: () => void;
    onAddAlbum: (album: NewAlbumState) => void;
}>) => {
    const { isOpen, onClose, onAddAlbum } = props;

    const [values, setValues] = useState<NewAlbumState>({
        albumName: '',
        description: '',
        avatar: ''
    });

    const handleChange = (prop: keyof NewAlbumState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setValues({ ...values, avatar: reader.result.toString() });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAlbum = () => {
        onAddAlbum(values);
        onClose();
        setValues({
            albumName: '',
            description: '',
            avatar: ''
        });
    };

    return (
        <StyledDialog open={isOpen} onClose={onClose}>
            <DialogTitle>Create New Album</DialogTitle>
            <DialogContent>
                <TextField
                    label="Album Name"
                    value={values.albumName}
                    onChange={handleChange('albumName')}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={values.description}
                    onChange={handleChange('description')}
                    fullWidth
                    margin="normal"
                    multiline
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{ backgroundColor: 'gray', color: '#fff' }}>Cancel</Button>
                <Button onClick={handleAddAlbum} style={{ backgroundColor: '#1bb76e', color: '#fff' }}>Add Album</Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default NewAlbumDialog;
