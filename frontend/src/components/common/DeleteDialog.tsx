import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { deleteFile } from "src/app/redux/slices/fileSlice";
import { deleteData } from "src/services/fileServices";
import { handleDeleteUserService } from "src/services/userServices";

type DeleteDialogProps = {
    deleteId: string;
    fileType?: string;
    deleteType: string;
    onDelete?: (deleteId: string) => void;
    onCancel?: () => void
};

const DeleteDialog = ({ deleteId, fileType, deleteType, onDelete, onCancel }: DeleteDialogProps) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.localStorage.userState.user);
    const accessToken = useSelector((state) => state.localStorage.userState.accessToken);

    const [isOpen, setOpen] = useState(true);

    const handleCloseDeleteDialog = () => {
        setOpen(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleDelete = async () => {
        try {
            // Đóng dialog
            handleCloseDeleteDialog();

            if (user) {
                if (deleteType === 'file' && fileType) {
                    dispatch(deleteFile({ type: fileType, deleteId: deleteId }));
                    await deleteData(user?._id, fileType, deleteId);
                } else {
                    console.log('check deleteId: ', deleteId);
                    if (onDelete) {
                        onDelete(deleteId);
                    }
                    await handleDeleteUserService(accessToken, deleteId);
                }
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
                    Are you sure you want to delete this {deleteType === 'file' ? 'file' : 'user'}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={handleDelete} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;