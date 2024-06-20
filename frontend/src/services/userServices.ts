import axios from "../axios"

export const handleCheckOTPService = (otp: string) => {
    return axios.post('/api/checkOTP', { otp })
}

export const handleRegisterService = (username: string, email: string, password: string, cfPassword: string) => {
    return axios.post('/api/register', { username, email, password, cfPassword })
}

export const handleLoginService = (email: string, password: string) => {
    return axios.post('/api/login', { email, password })
}

export const handleSetUserInfoService = (email: string) => {
    return axios.post('/api/setUserInfo', { email })
}

export const handleUpdateUserInfoService = (email: string, username: string, avatar?: string, birthDate?: Date, phoneNum?: string, gender?: string) => {
    return axios.post('/api/updateUserInfo', { email, username, avatar, birthDate, phoneNum, gender })
}

export const handleForgetPasswordService = (email: string) => {
    return axios.post('/api/forgerPassword', { email })
}

export const handleResetPasswordService = (password: string, cfPassword: string) => {
    return axios.post("/api/resetPassword", { password, cfPassword })
}

export const handleGetAllUserService = (accessToken: string, arg?: string) => {
    return axios.get("/api/get-user", {
        params: { arg },
        headers: { token: `Bearer ${accessToken}` }
    })
}

export const handleDeleteUserService = (accessToken: string, _id: string) => {
    return axios.delete("/api/delete-user", {
        params: { _id },
        headers: { token: `Bearer ${accessToken}` }
    })
}
