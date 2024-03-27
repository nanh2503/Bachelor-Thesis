import { combineReducers } from "redux";
import loginReducer, { LoginState } from "../slices/loginSlice";
import fileListReducer, { FileListState } from "../slices/fileSlice";
import userInfoReducer, { UserInfoState } from "../slices/userInfoSlice";
import uploadFileReducer, { UploadFileState } from "../slices/uploadFileSlice";

export type RootState = {
    loginState: LoginState;
    fileListState: FileListState;
    userInfoState: UserInfoState;
    uploadFileState: UploadFileState;
}

export const rootReducers = combineReducers<RootState>({
    loginState: loginReducer,
    fileListState: fileListReducer,
    userInfoState: userInfoReducer,
    uploadFileState: uploadFileReducer

});
