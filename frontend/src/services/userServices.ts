import axios from "../axios"

export const handleLoginService = (email: string, password: string) => {
    return axios.post('/api/login',{email, password})
}

