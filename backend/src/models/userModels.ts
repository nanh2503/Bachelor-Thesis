import mongoose from "mongoose";

export interface UserInterface {
    username: string,
    email: string,
    password: string,
    image: string,
    avatar: string,
    phonenum: string,
}

const schema = new mongoose.Schema<UserInterface>({
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
        required: true
    },
    phonenum: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
})

const User = mongoose.models.user || mongoose.model<UserInterface>('user', schema)

export default User;