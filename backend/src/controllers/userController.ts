import { Request, Response } from "express";
import { handleUserLogin, handleUserRegister } from "../services/userServices";

interface User {
    username: string;
    email: string;
    password: string;
    cfPassword: string;
}

export interface UserData {
    errCode: number;
    errMessage: string;
    user?: Partial<User>;
}

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    console.log('backend');
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        const errorResponse: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!'
        };
        res.status(500).json(errorResponse);
        return;
    }

    let userData = await handleUserLogin(email, password);

    const response: UserData = {
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    };

    res.status(200).json(response);
};

export const handleRegister = async (req: Request, res: Response): Promise<void> => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cfPassword = req.body.cfPassword;

    if (!username || !email || !password || !cfPassword) {
        const errorResponse: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!'
        };
        res.status(500).json(errorResponse);
        return;
    }

    let userData = await handleUserRegister(username, email, password, cfPassword);

    const response: UserData = {
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    };

    res.status(200).json(response);
}
