import axios from "../axios"

export const handleUploadCloudService = (api: string, data: FormData) => {
    return axios.post(api, data);
}

export const handleGetSignatureForUpload = (folder: string) => {
    return axios.post('/api/sign-upload', { folder });
}

export const handleUploadBackendService = (username: string, imageUrl: string[], videoUrl: string[], titles: string, descriptions: string[], base64CodeImage: string[], base64CodeVideo: string[], tagList: string[]) => {
    return axios.post('/api/upload', { username, imageUrl, videoUrl, titles, descriptions, base64CodeImage, base64CodeVideo, tagList })
}

export const handleFetchData = (arg: string) => {
    return axios.get('/api/get-file', { params: { arg } })
}

export const updateData = (id: string, title: string, description: string) => {
    return axios.put('/api/update', { id, title, description })
}

export const deleteData = (fileType: string, id: string) => {
    return axios.delete('/api/delete', { params: { fileType, id } });
}

export const clickIncrease = (fileType: string, id: string) => {
    return axios.put('/api/click-increase', { fileType, id })
}

export const setFavoriteFile = (fileType: string, id: string) => {
    return axios.put('/api/set-favorite', { fileType, id })
}