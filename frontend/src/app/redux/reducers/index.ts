import { combineReducers } from "redux";
import loginReducer, { LoginState } from "../slices/loginSlice";
import fileListReducer, { FileListState } from "../slices/fileSlice";

export type RootState = {
    loginState: LoginState;
    fileListState: FileListState;
}

export const rootReducers = combineReducers<RootState>({
    loginState: loginReducer,
    fileListState: fileListReducer
});
