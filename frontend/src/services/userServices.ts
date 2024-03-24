import axios from "../axios"

export const handleLoginService = (email: string, password: string) => {
    return axios.post('/api/login', { email, password })
}

export const handleRegisterService = (username: string, email: string, password: string, cfPassword: string) => {
    return axios.post('/api/register', { username, email, password, cfPassword })
}

export const handleSetUserInfoService = (email: string, username: string, avatar?: string, birthDate?: Date, phoneNum?: string, gender?: string) => {
    return axios.post('/api/setUserInfo', { email, username, avatar, birthDate, phoneNum, gender })
}

