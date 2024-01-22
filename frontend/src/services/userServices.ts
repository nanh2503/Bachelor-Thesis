import axios from "../axios"

export const handleLoginService = (email: string, password: string) => {
    return axios.post('/api/login', { email, password })
}

export const handleRegisterService = (username: string, email: string, password: string, cfPassword: string) => {
    return axios.post('/api/register', { username, email, password, cfPassword })
}

export const handleUploadCloudService = (api: string, data: FormData) => {
    return axios.post(api, data);
}

export const handleGetSignatureForUpload = (folder: string) => {
    console.log('check2');

    return axios.post('/api/sign-upload', { folder });
}

export const handleUploadBackendService = (imageUrl: string, videoUrl: string) => {
    return axios.post('/api/upload', { imageUrl, videoUrl })
}
