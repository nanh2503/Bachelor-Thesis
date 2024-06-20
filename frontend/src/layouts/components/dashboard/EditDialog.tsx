import styled from 'styled-components';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, PropsWithoutRef, useState } from "react";
import { User } from "src/app/redux/slices/userSlice";

interface UserState {
    username: string,
    email: string,
    role: string,
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

const EditDialog = (props: PropsWithoutRef<{
    user: User;
    isOpen: boolean;
    onClose: () => void
}>) => {
    const { user, isOpen, onClose } = props;

    const [values, setValues] = useState<UserState>({
        username: user.username,
        email: user.email,
        role: user.role
    })

    const handleChange = (prop: keyof UserState) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleSaveChanges = async () => {
        try {
            // await updateUser()
            console.log("Edit User success");
        } catch (error) {
            console.error('Error during save:', error);
        }

        onClose();
    };

    return (
        <StyledDialog open={isOpen} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <TextField
                    label="User"
                    value={values.username}
                    onChange={handleChange("username")}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={values.email}
                    onChange={handleChange("email")}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Role"
                    value={values.role}
                    onChange={handleChange("role")}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save</Button>
            </DialogActions>
        </StyledDialog>
    )
}

export default EditDialog;
