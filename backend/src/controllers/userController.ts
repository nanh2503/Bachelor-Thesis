import { Request, Response } from "express";
import { handleUserLogin } from "../services/userServices";

interface User {
    email: string;
    password: string;
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

export default handleLogin;
