import mongoose from "mongoose";

export interface UserOTPVerificationInterface {
    email: string,
    otp: string,
    createAt: Date,
    expiresAt: Date
}

const schema = new mongoose.Schema<UserOTPVerificationInterface>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
})

const UserOTPVerification = mongoose.model<UserOTPVerificationInterface>('userOtpVerification', schema);

export default UserOTPVerification;