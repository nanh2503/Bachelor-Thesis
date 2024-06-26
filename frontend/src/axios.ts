import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

instance.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response);
    }
);

export default instance;
