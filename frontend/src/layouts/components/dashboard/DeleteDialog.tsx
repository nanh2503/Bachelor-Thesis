import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "src/app/hooks";
import { deleteImage, deleteVideo } from "src/app/redux/slices/fileSlice";
import { deleteData } from "src/services/fileServices";

const DeleteDialog = (props: { deleteId: string, fileType: string }) => {
    const { deleteId, fileType } = props;

    const dispatch = useDispatch();

    const [isOpen, setOpen] = useState(true);

    const handleCloseDeleteDialog = () => {
        setOpen(false);
    };

    const handleDeleteFile = async () => {
        try {
            // Đóng dialog
            handleCloseDeleteDialog();

            if (fileType === 'image') {
                dispatch(deleteImage({ deleteId: deleteId }));
                await deleteData(fileType, deleteId);
            } else {
                dispatch(deleteVideo({ deleteId: deleteId }))
                await deleteData(fileType, deleteId);
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body2">
                    Are you sure you want to delete this image?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={handleDeleteFile} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;