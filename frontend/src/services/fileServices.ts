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

export const handleFetchData = (arg: string) => {
    return axios.get('/api/get-file', { params: { arg } })
}

export const updateData = (id: string, title: string, description: string) => {
    return axios.put('/api/update', { id, title, description })
}

export const deleteData = (id: string) => {
    return axios.delete('/api/delete', { params: { id } });
}