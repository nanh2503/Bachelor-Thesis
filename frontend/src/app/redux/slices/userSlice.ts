import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    _id: string,
    username: string,
    email: string,
    role: string
}

export interface UserState {
    isLoggedIn: boolean;
    user: User | null;
    accessToken: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    user: null,
    accessToken: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: User, accessToken: string }>) => {
            const { user, accessToken } = action.payload;

            state.isLoggedIn = true;
            state.user = user;
            state.accessToken = accessToken;
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.accessToken = "";
        },
    }
})

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;