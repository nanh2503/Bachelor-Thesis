import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Image {
    _id: string,
    imageUrl: string,
    description: string,
    title: string
}

export interface Video {
    _id: string,
    videoUrl: string,
    description: string,
    title: string
}

export interface FileList {
    _id: string,
    images: Image[],
    videos: Video[],
    title: string
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
        updateFile: (state, action: PayloadAction<{ id: string; title: string; description: string }>) => {
            return {
                ...state,
                file: state.file.map(file => {
                    // Lọc ra file chứa ảnh cần cập nhật
                    if (file.images.some(image => image._id === action.payload.id)) {
                        // Cập nhật thông tin cho ảnh trong mảng images
                        return {
                            ...file,
                            images: file.images.map(image => {
                                if (image._id === action.payload.id) {
                                    console.log('image: ', JSON.stringify(image));
                                    console.log('title chedck: ', action.payload.title);
                                    console.log('description chedck: ', action.payload.description);

                                    // Cập nhật thông tin cho ảnh
                                    const updatedImage = {
                                        ...image,
                                        title: action.payload.title,
                                        description: action.payload.description,
                                    };

                                    console.log('updatedImage: ', JSON.stringify(updatedImage));

                                    return updatedImage;
                                }

                                return image;
                            }),
                        };
                    }

                    return file;
                }),
            };
        },
        deleteFile: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;

            // Sử dụng map để tạo mảng mới, áp dụng filter cho mỗi đối tượng file
            state.file = state.file.map(file => ({
                ...file,
                images: file.images ? file.images.filter(image => image._id !== id) : file.images,
            }));
        }
    }
})

export const { setFileList, updateFileList, updateFile, deleteFile } = fileListState.actions;
export default fileListState.reducer; 