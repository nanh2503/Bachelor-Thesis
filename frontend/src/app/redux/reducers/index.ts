import { combineReducers } from 'redux';
import userReducer from '../slices/userSlice';
import fileListReducer from '../slices/fileSlice';
import userInfoReducer from '../slices/userInfoSlice';
import uploadFileReducer from '../slices/uploadFileSlice';

export const rootReducers = combineReducers({
    userState: userReducer,
    fileListState: fileListReducer,
    userInfoState: userInfoReducer,
    uploadFileState: uploadFileReducer,
});

export type RootState = ReturnType<typeof rootReducers>;
