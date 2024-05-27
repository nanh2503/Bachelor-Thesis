import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Video } from "mdi-material-ui";

export interface Image {
    _id: string,
    imageUrl: string,
    description: string,
    base64CodeImage: string,
    clickNum: number,
    isFavorite: boolean,
}

export interface Video {
    _id: string,
    videoUrl: string,
    description: string,
    base64CodeVideo: string,
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
    favorVideoNum: number
}

const initialState: FileListState = {
    file: [],
    imagesNum: 0,
    videosNum: 0,
    favoriteFile: [],
    favorImageNum: 0,
    favorVideoNum: 0
}

const fileListState = createSlice({
    name: 'fileList',
    initialState,
    reducers: {
        setFileList: (state, action: PayloadAction<FileList[]>) => {
            state.file = action.payload;
            let numberOfImages = 0;
            let numberOfVideos = 0;
            let favorImages = 0;
            let favorVideos = 0;

            const listFile: FileList[] = [];

            state.file.map(file => {
                numberOfImages += file.images.length;
                numberOfVideos += file.videos.length;

                const fileItem: FileList = {
                    _id: "",
                    images: [],
                    videos: [],
                    title: "",
                    tagList: []
                };

                file.images.map(image => {
                    if (image.isFavorite) {
                        fileItem.images.push(image);
                        favorImages++;
                    }
                })

                file.videos.map(video => {
                    if (video.isFavorite) {
                        fileItem.videos.push(video);
                        favorVideos++;
                    }
                })

                if (fileItem.images.length > 0 || fileItem.videos.length > 0) {
                    fileItem._id = file._id;
                    fileItem.title = file.title;
                    fileItem.tagList = file.tagList;

                    listFile.push(fileItem);
                }
            })

            state.imagesNum = numberOfImages;
            state.videosNum = numberOfVideos;
            state.favoriteFile = listFile;
            state.favorImageNum = favorImages;
            state.favorVideoNum = favorVideos;
        },
        updateFileList: (state, action: PayloadAction<FileList[]>) => {
            let numberOfImages = 0;
            let numberOfVideos = 0;

            action.payload?.map(file => {
                numberOfImages += file.images.length;
                numberOfVideos += file.videos.length;
            })

            return {
                ...state,
                file: [...state.file, ...action.payload],
                imagesNum: state.imagesNum + numberOfImages,
                videosNum: state.videosNum + numberOfVideos,
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

            state.imagesNum = state.imagesNum - 1;

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

            state.videosNum = state.videosNum - 1;

            state.file = state.file.filter(file => file.images.length > 0 || file.videos.length > 0);
        },
        setClickNumImage: (state, action: PayloadAction<{ fileId: string }>) => {
            const { fileId } = action.payload;
            const updateFile = state.file.map(file => {
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

            return {
                ...state,
                file: updateFile
            }
        },
        setClickNumVideo: (state, action: PayloadAction<{ fileId: string }>) => {
            const { fileId } = action.payload;
            const updateFile = state.file.map(file => {
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

            return {
                ...state,
                file: updateFile
            }
        },
        setFavoriteImage: (state, action: PayloadAction<{ fileId: string }>) => {
            const { fileId } = action.payload;
            const fileItem: FileList = {
                _id: "",
                images: [],
                videos: [],
                title: "",
                tagList: []
            }

            state.file = state.file.map(file => {
                const updateImages = file.images.map(image => {
                    if (image._id === fileId) {
                        return {
                            ...image,
                            isFavorite: !image.isFavorite
                        };
                    }

                    return image;
                })

                return {
                    ...file,
                    images: updateImages
                }
            });

            state.file.map(file => {
                file.images.map(image => {
                    if (image._id === fileId) {
                        if (!image.isFavorite) {
                            state.favoriteFile = state.favoriteFile.map(file => ({
                                ...file,
                                images: file.images.filter(image => image._id !== fileId)
                            }))

                            state.favoriteFile = state.favoriteFile.filter(file => file.images.length > 0 || file.videos.length > 0);


                            state.favorImageNum = state.favorImageNum - 1;
                        } else {
                            fileItem.images.push(image);
                            fileItem._id = file._id;
                            fileItem.title = file.title;
                            fileItem.tagList = file.tagList;

                            state.favorImageNum = state.favorImageNum + 1;
                        }
                    }
                })
            })

            if (fileItem.images.length > 0) {
                state.favoriteFile.push(fileItem);
            }
        },
        setFavoriteVideo: (state, action: PayloadAction<{ fileId: string }>) => {
            const { fileId } = action.payload;
            const fileItem: FileList = {
                _id: "",
                images: [],
                videos: [],
                title: "",
                tagList: []
            }

            state.file = state.file.map(file => {
                const updateVideos = file.videos.map(video => {
                    if (video._id === fileId) {
                        return {
                            ...video,
                            isFavorite: !video.isFavorite
                        }
                    }

                    return video;
                })

                return {
                    ...file,
                    videos: updateVideos
                };
            })

            state.file.map(file => {
                file.videos.map(video => {
                    if (video._id === fileId) {
                        if (!video.isFavorite) {
                            state.favoriteFile = state.favoriteFile.map(file => ({
                                ...file,
                                videos: file.videos.filter(video => video._id !== fileId)
                            }))

                            state.favoriteFile = state.favoriteFile.filter(file => file.images.length > 0 || file.videos.length > 0);

                            state.favorVideoNum = state.favorVideoNum - 1;
                        } else {
                            fileItem.videos.push(video);
                            fileItem._id = file._id;
                            fileItem.title = file.title;
                            fileItem.tagList = file.tagList;

                            state.favorVideoNum = state.favorVideoNum + 1;
                        }

                    }
                })
            })

            if (fileItem.videos.length > 0) {
                state.favoriteFile.push(fileItem);
            }

        }
    }
})

export const { setFileList, updateFileList, updateImage, deleteImage, updateVideo, deleteVideo, setClickNumImage, setClickNumVideo, setFavoriteImage, setFavoriteVideo } = fileListState.actions;
export default fileListState.reducer;

