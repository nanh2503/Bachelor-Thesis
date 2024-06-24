import axios from "../axios"

export const handleUploadCloudService = (api: string, data: FormData) => {
    return axios.post(api, data);
}

export const handleGetSignatureForUpload = (folder: string) => {
    return axios.post('/api/sign-upload', { folder });
}

export const handleUploadBackendService = (userId: string, imageUrl: string[], videoUrl: string[], titles: string, descriptions: string[], tagList: string[]) => {
    return axios.post('/api/upload', { userId, imageUrl, videoUrl, titles, descriptions, tagList })
}

export const handleFetchData = (arg: string, page?: number) => {
    return axios.get('/api/get-file', { params: { arg, page } })
}

export const handleGetFavoriteFile = (userId: string, page?: number) => {
    return axios.get('/api/get-favorite-file', { params: { userId, page } })
}

export const updateData = (userId: string, fileType: string, id: string, title: string, description: string, tagList: string[]) => {
    return axios.put('/api/update', { userId, fileType, id, title, description, tagList })
}

export const deleteData = (userId: string, fileType: string, id: string) => {
    return axios.delete('/api/delete', { params: { userId, fileType, id } });
}

export const clickIncrease = (userId: string, fileType: string, id: string) => {
    return axios.put('/api/click-increase', { userId, fileType, id })
}

export const setFavoriteFileService = (userId: string, fileType: string, id: string) => {
    return axios.put('/api/set-favorite', { userId, fileType, id })
}