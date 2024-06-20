import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Image {
    _id: string,
    imageUrl: string,
    description: string,
    clickNum: number,
    isFavorite: boolean,
}

export interface Video {
    _id: string,
    videoUrl: string,
    description: string,
    clickNum: number,
    isFavorite: boolean,
}

export interface FileList {
    _id: string,
    images: Image[],
    videos: Video[],
    title: string,
    tagList: string[]
}

export interface FileListState {
    file: FileList[],
    imagesNum: number,
    videosNum: number,
    favoriteFile: FileList[],
    favorImageNum: number,
    favorVideoNum: number,
    fileDelete: { type: string | null, id: string | null } | null,
    fileEdit: { type: string | null, id: string | null } | null,
    fileView: { file: Image | Video | null, title: string | null, tagList: string[] | null } | null,
    fileDisFavor: { type: string | null, id: string | null } | null,
}

const initialState: FileListState = {
    file: [],
    imagesNum: 0,
    videosNum: 0,
    favoriteFile: [],
    favorImageNum: 0,
    favorVideoNum: 0,
    fileDelete: null,
    fileEdit: null,
    fileView: null,
    fileDisFavor: null
}

const fileListState = createSlice({
    name: 'fileList',
    initialState,
    reducers: {
        setFileList: (state, action: PayloadAction<{ imagesNum: number, videosNum: number }>) => {
            const { imagesNum, videosNum } = action.payload;

            state.imagesNum = imagesNum;
            state.videosNum = videosNum;
        },
        setFavoriteFileList: (state, action: PayloadAction<{ favorImageNum: number, favorVideoNum: number }>) => {
            const { favorImageNum, favorVideoNum } = action.payload;

            state.favorImageNum = favorImageNum;
            state.favorVideoNum = favorVideoNum;
        },
        updateFileList: (state, action: PayloadAction<{ imagesNum: number, videosNum: number }>) => {
            const { imagesNum, videosNum } = action.payload;

            state.imagesNum += imagesNum;
            state.videosNum += videosNum;
        },
        setFileView: (state, action: PayloadAction<{ file: Image | Video, title?: string, tagList?: string[] }>) => {
            const { file, title, tagList } = action.payload;
            console.log('check state file: ', file);

            state.fileView = {
                file,
                title: title ?? null,
                tagList: tagList ?? null
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
        deleteFile: (state, action: PayloadAction<{ type: string | null, deleteId: string | null }>) => {
            const { type, deleteId } = action.payload;
            state.fileDelete = { type: type, id: deleteId };

            if (type === 'image') {
                state.imagesNum -= 1;
            } else if (type === 'video') {
                state.videosNum -= 1;
            }
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
        setClickNumFile: (state, action: PayloadAction<{ fileId: string, fileType: string }>) => {
            const { fileId, fileType } = action.payload;
            let updateFile;
            if (fileType === 'image') {
                updateFile = state.file.map(file => {
                    if (file.images.some(image => image._id === fileId)) {
                        return {
                            ...file,
                            images: file.images.map(image => {
                                if (image._id === fileId) {
                                    return {
                                        ...image,
                                        clickNum: image.clickNum + 1
                                    }
                                }

                                return image;
                            })
                        }
                    }

                    return file;
                })
            } else {
                updateFile = state.file.map(file => {
                    if (file.videos.some(video => video._id === fileId)) {
                        return {
                            ...file,
                            videos: file.videos.map(video => {
                                if (video._id === fileId) {
                                    return {
                                        ...video,
                                        clickNum: video.clickNum + 1
                                    }
                                }

                                return video;
                            })
                        }
                    }

                    return file;
                })
            }

            return {
                ...state,
                file: updateFile
            }
        },
        setFavoriteFile: (state, action: PayloadAction<{ fileType: string | null, fileId: string | null, isFavor: boolean | null }>) => {
            const { fileType, fileId, isFavor } = action.payload;

            if (fileType === 'image') {
                if (isFavor) {
                    state.favorImageNum += 1;
                } else {
                    state.favorImageNum -= 1;
                    state.fileDisFavor = { type: fileType, id: fileId }
                }
            } else if (fileType === 'video') {
                if (isFavor) {
                    state.favorVideoNum += 1;
                } else {
                    state.favorVideoNum -= 1;
                    state.fileDisFavor = { type: fileType, id: fileId }
                }
            }
        },
    }
})

export const { setFileList, setFavoriteFileList, updateFileList, updateImage, deleteFile, updateVideo, setClickNumFile, setFavoriteFile, setFileView } = fileListState.actions;
export default fileListState.reducer;

