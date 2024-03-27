import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadFileState {
    imagesReview: string[],
    videosReview: string[],
    title: string,
    descriptions: string[]
}

const initialState: UploadFileState = {
    imagesReview: [],
    videosReview: [],
    title: '',
    descriptions: []
}

const uploadFileState = createSlice({
    name: 'uploadFile',
    initialState,
    reducers: {
        setImagesReview: (state, action: PayloadAction<string[]>) => {
            return {
                ...state,
                imagesReview: [...state.imagesReview, ...action.payload]
            };
        },
        setVideosReview: (state, action: PayloadAction<string[]>) => {
            return {
                ...state,
                videosReview: [...state.videosReview, ...action.payload]
            };
        },
        clearFiles: (state) => {
            state.imagesReview = [];
            state.videosReview = [];
            state.title = '';
            state.descriptions = [];
        },
        setTitles: (state, action) => {
            state.title = action.payload
        },
        setDescriptions: (state, action: PayloadAction<string[]>) => {
            state.descriptions = action.payload
        }
    }
})

export const { setTitles, setDescriptions, clearFiles, setImagesReview, setVideosReview } = uploadFileState.actions;
export default uploadFileState.reducer;