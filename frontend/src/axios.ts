import axios, { AxiosInstance } from "axios"

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

export default instance