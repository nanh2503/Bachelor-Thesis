import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "src/app/hooks";
import { updateImage, updateVideo } from "src/app/redux/slices/fileSlice";
import { updateData } from "src/services/fileServices";

const EditDialog = (props: { editId: string, editTitle: string, editDescription: string, fileType: string, tagList: string[] }) => {
    const { editId, editTitle, editDescription, fileType, tagList } = props;

    const dispatch = useDispatch();

    const [isOpen, setOpen] = useState(false);
    const [title, setTitle] = useState(editTitle);
    const [description, setDescription] = useState(editDescription);

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle)
    };

    const handleDescriptionChange = (newDescription: string) => {
        setDescription(newDescription)
    };

    const handleSaveChanges = async () => {
        try {
            if (fileType === 'image') {
                dispatch(updateImage({ editId, editTitle, editDescription, editTagList: tagList }))
            } else {
                dispatch(updateVideo({ editId, editTitle, editDescription, editTagList: tagList }))
            }

            await updateData(editId, editTitle, editDescription)
        } catch (error) {
            console.error('Error during save:', error);
        }

        // Đóng dialog
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onClose={() => setOpen(false)}>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditDialog;