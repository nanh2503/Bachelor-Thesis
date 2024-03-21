import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    dateOfBirth: Date,
    phoneNum: string,
    avatar: string
}

export interface UserInfoState {
    userInfo: UserInfo | null;
}

const initialState: UserInfoState = {
    userInfo: null,
}

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            console.log('user Info: ', action.payload);
            state.userInfo = action.payload
        }
    }
})

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

