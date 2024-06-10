import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "src/app/hooks";
import { deleteFile } from "src/app/redux/slices/fileSlice";
import { deleteData } from "src/services/fileServices";

const DeleteDialog = (props: { deleteId: string, fileType: string }) => {
    const { deleteId, fileType } = props;

    const dispatch = useDispatch();

    const user = useSelector((state) => state.localStorage.userInfoState.userInfo);

    const [isOpen, setOpen] = useState(true);

    const handleCloseDeleteDialog = () => {
        setOpen(false);
    };

    const handleDeleteFile = async () => {
        try {
            // Đóng dialog
            handleCloseDeleteDialog();

            if (user) {
                dispatch(deleteFile({ type: fileType, deleteId: deleteId }));
                await deleteData(user?.username, fileType, deleteId);
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