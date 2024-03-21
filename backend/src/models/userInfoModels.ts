import mongoose from "mongoose";

export interface UserInfoInterface {
    avatar: string,
    phonenum: string,
    dateOfBirth: Date,
}

const schema = new mongoose.Schema<UserInfoInterface>({
    phonenum: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    }
})

const UserInfo = mongoose.models.userInfo || mongoose.model<UserInfoInterface>('userInfo', schema)

export default UserInfo;