import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Image {
    _id: string,
    imageUrl: string,
    description: string,
    base64CodeImage: string,
}

export interface Video {
    _id: string,
    videoUrl: string,
    description: string,
    base64CodeVideo: string,
}

export interface FileList {
    _id: string,
    images: Image[],
    videos: Video[],
    title: string,
    tagList: string[]
}

export interface FileListState {
    file: FileList[]
}

const initialState: FileListState = {
    file: []
}

const fileListState = createSlice({
    name: 'fileList',
    initialState,
    reducers: {
        setFileList: (state, action: PayloadAction<FileList[]>) => {
            state.file = action.payload;
        },
        updateFileList: (state, action: PayloadAction<FileList[]>) => {
            return {
                ...state,
                file: [...state.file, ...action.payload]
            };
        },
        updateImage: (state, action: PayloadAction<{ editId: string; editTitle: string; editDescription: string; editTagList: string[] }>) => {
            const { editId, editTitle, editDescription, editTagList } = action.payload;
            const updatedFiles = state.file.map(file => {
                if (file.images.some(image => image._id === editId)) {
                    return {
                        ...file,
                        title: editTitle,
                        tagList: editTagList,
                        images: file.images.map(image => {
                            if (image._id === editId) {
                                return {
                                    ...image,
                                    description: editDescription,
                                }
                            }

                            return image;
                        })
                    }
                }

                return file;
            })

            return {
                ...state,
                file: updatedFiles
            };
        },
        deleteImage: (state, action: PayloadAction<{ deleteId: string }>) => {
            const { deleteId } = action.payload;

            // Sử dụng map để tạo mảng mới, áp dụng filter cho mỗi đối tượng file
            state.file = state.file.map(file => ({
                ...file,
                images: file.images ? file.images.filter(image => image._id !== deleteId) : file.images,
            }));

            state.file = state.file.filter(file => file.images.length > 0 || file.videos.length > 0);
        },
        updateVideo: (state, action: PayloadAction<{ editId: string; editTitle: string; editDescription: string; editTagList: string[] }>) => {
            const { editId, editTitle, editDescription, editTagList } = action.payload;
            const updatedFiles = state.file.map(file => {
                if (file.videos.some(video => video._id === editId)) {
                    return {
                        ...file,
                        title: editTitle,
                        tagList: editTagList,
                        videos: file.videos.map(video => {
                            if (video._id === editId) {
                                return {
                                    ...video,
                                    description: editDescription,
                                }
                            }

                            return video;
                        })
                    }
                }

                return file;
            })

            return {
                ...state,
                file: updatedFiles
            };
        },
        deleteVideo: (state, action: PayloadAction<{ deleteId: string }>) => {
            const { deleteId } = action.payload;

            // Sử dụng map để tạo mảng mới, áp dụng filter cho mỗi đối tượng file
            state.file = state.file.map(file => ({
                ...file,
                videos: file.videos ? file.videos.filter(video => video._id !== deleteId) : file.videos,
            }));

            state.file = state.file.filter(file => file.images.length > 0 || file.videos.length > 0);
        },
    }
})

export const { setFileList, updateFileList, updateImage, deleteImage, updateVideo, deleteVideo } = fileListState.actions;
export default fileListState.reducer;

