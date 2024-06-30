import mongoose from "mongoose";

export interface UserInfoInterface {
    email: string,
    username: string,
    avatar: string,
    phoneNum: string,
    birthDate: Date,
    gender: string
}

const schema = new mongoose.Schema<UserInfoInterface>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
})

const UserInfo = mongoose.models.userInfo || mongoose.model<UserInfoInterface>('userInfo', schema)

export default UserInfo;