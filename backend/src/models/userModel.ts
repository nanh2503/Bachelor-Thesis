import mongoose from "mongoose";

interface UserInter {
    username: string,
    email: string,
    password: string,
    phonenum: string,
    images: string,
}

const schema = new mongoose.Schema<UserInter>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phonenum:{
        type: String,
        required: false,
    },
    images:{
        type: String,
        required: false,
    }
})

const User = mongoose.models.user || mongoose.model<UserInter>('user', schema)

export default User;