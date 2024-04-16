import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    email: string,
    avatar: string,
    username: string,
    birthDate: Date,
    phoneNum: string,
    gender: string
}

export interface UserInfoState {
    userInfo: UserInfo | null;
}

const initialState: UserInfoState = {
    userInfo: null,
}

const userInfoState = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        }
    }
})

export const { setUserInfo } = userInfoState.actions;
export default userInfoState.reducer;

