import axios from "../axios"

export const handleUploadCloudService = (api: string, data: FormData) => {
    return axios.post(api, data);
}

export const handleGetSignatureForUpload = (folder: string) => {
    return axios.post('/api/sign-upload', { folder });
}

export const handleUploadBackendService = (username: string, imageUrl: string[], videoUrl: string[], titles: string, descriptions: string[], tagList: string[]) => {
    return axios.post('/api/upload', { username, imageUrl, videoUrl, titles, descriptions, tagList })
}

export const handleFetchData = (arg: string, page?: number) => {
    return axios.get('/api/get-file', { params: { arg, page } })
}

export const handleGetFavoriteFile = (username: string, page?: number) => {
    return axios.get('/api/get-favorite-file', { params: { username, page } })
}

export const updateData = (username: string, fileType: string, id: string, title: string, description: string, tagList: string[]) => {
    return axios.put('/api/update', { username, fileType, id, title, description, tagList })
}

export const deleteData = (username: string, fileType: string, id: string) => {
    return axios.delete('/api/delete', { params: { username, fileType, id } });
}

export const clickIncrease = (username: string, fileType: string, id: string) => {
    return axios.put('/api/click-increase', { username, fileType, id })
}

export const setFavoriteFileService = (username: string, fileType: string, id: string) => {
    return axios.put('/api/set-favorite', { username, fileType, id })
}