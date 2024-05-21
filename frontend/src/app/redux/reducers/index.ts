import { combineReducers } from 'redux';
import loginReducer from '../slices/loginSlice';
import fileListReducer from '../slices/fileSlice';
import userInfoReducer from '../slices/userInfoSlice';
import uploadFileReducer from '../slices/uploadFileSlice';

export const rootReducers = combineReducers({
    loginState: loginReducer,
    fileListState: fileListReducer,
    userInfoState: userInfoReducer,
    uploadFileState: uploadFileReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
