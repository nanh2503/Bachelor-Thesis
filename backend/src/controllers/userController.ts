import { Request, Response } from "express";
import { handleCheckOTP, handleUserLogin, handleUserRegister } from "../services/userServices";

interface UserInterface {
    username: string;
    email: string;
    password: string;
    cfPassword: string;
}

export interface UserData {
    errCode: number;
    errMessage: string;
    user?: Partial<UserInterface>;
}

export const handleCheckUserOTP = async (req: Request, res: Response): Promise<void> => {
    let { otp } = req.body;

    if (!otp) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'The otp is required!',
            user: {}
        }
        res.status(400).json(response);
    } else {
        let userData = await handleCheckOTP(otp);

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {}
        }

        res.status(200).json(response);
    }
}

export const handleRegister = async (req: Request, res: Response): Promise<void> => {
    let { username, email, password, cfPassword } = req.body;

    if (!username || !email || !password || !cfPassword) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: {}
        };
        res.status(400).json(response);
    } else if (!/^[a-zA-Z]*$/.test(username)) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Invalid username entered!',
            user: {}
        };
        res.status(400).json(response);
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Invalid email entered!',
            user: {}
        };
        res.status(400).json(response);
    } else if (password.length < 8) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Password is too short!',
            user: {}
        };
        res.status(400).json(response);
    } else {
        let userData = await handleUserRegister(username, email, password, cfPassword);

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : {}
        };

        res.status(200).json(response);
    }
}

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        const errorResponse: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: {}
        };
        res.status(400).json(errorResponse);
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
