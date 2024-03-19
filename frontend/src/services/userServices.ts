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

export const handleUploadBackendService = (username: string, imageUrl: string[], videoUrl: string[], titles: string, descriptions: string[]) => {
    return axios.post('/api/upload', { username, imageUrl, videoUrl, titles, descriptions })
}

export const handleFetchData = (arg: string) => {
    console.log('arg: ', arg);

    return axios.get('/api/get-file', { params: { arg } })
}

export const updateData = (id: string, title: string, description: string) => {
    return axios.put('/api/update', { id, title, description })
}

export const deleteData = (id: string) => {
    console.log("id delete: ", id);
    return axios.delete('/api/delete', { params: { id } });
}
