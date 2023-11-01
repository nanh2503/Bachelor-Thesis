import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User{
    username: string,
    email: string,
    password: string
}

export interface LoginState {
    isLoggedIn: boolean;
    user: User | null;
}

const initialState: LoginState = {
    isLoggedIn: false,
    user: null,
}

const loginSlice = createSlice({
    name:'login',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            console.log('action: ',action);
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            console.log('logout success');
        },
    }
})

export const {setUser, logoutUser} = loginSlice.actions;
export const selectUser = (state: {login: LoginState}) => {state.login.user};
export const selectIsLoggedIn = (state: {login: LoginState}) => {state.login.isLoggedIn};
export default loginSlice.reducer;