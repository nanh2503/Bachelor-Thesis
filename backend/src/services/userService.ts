import { UserData } from "../controllers/userController";
import User from "../models/userModels";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import UserOTPVerification from "../models/UserOTPVerification";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

export const handleGetUserService = async (arg: string): Promise<UserData> => {
    try {
        let userData: UserData = { errCode: -1, errMessage: '', user: [] };
        if (arg === 'All') {
            const userList = await User.find({}, { _id: 1, username: 1, email: 1, role: 1 });

            userData.errCode = 0;
            userData.errMessage = 'Get All User successful!';
            userData.user = userList;
        }
        else {
            const userList = await User.find({}, { _id: 1, username: 1, email: 1, role: 1 });

            userData.errCode = 0;
            userData.errMessage = 'Get User successful!';
            userData.user = userList;
        }

        return userData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleDeleteUserService = async (_id: string): Promise<UserData> => {
    try {
        let userData: UserData = { errCode: -1, errMessage: '', user: [] };
        let isExist = await User.findOne({ _id: _id })

        if (isExist) {
            const user = await User.deleteOne({ _id: _id })

            userData.errCode = 0;
            userData.errMessage = 'Delete user successful!';
        } else {
            userData.errCode = 1;
            userData.errMessage = "This user isn't exist in the system. Please try again!";
        }

        return userData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


