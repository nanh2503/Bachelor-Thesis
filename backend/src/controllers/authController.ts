import { Request, Response } from "express";
import { handleCheckOTP, handleForgetPassword, handleResetPassword, handleUserLogin, handleUserRegister } from "../services/authService";

interface UserInterface {
    username: string;
    email: string;
    password: string;
    cfPassword: string;
}
export interface UserData {
    action?: string;
    errCode: number;
    errMessage: string;
    user?: Partial<UserInterface>[];
    accessToken?: string;
    refreshToken?: string;
}

let refreshTokens: string[] = [];

export const handleCheckUserOTP = async (req: Request, res: Response): Promise<void> => {
    let { otp } = req.body;

    if (!otp) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'The otp is required!',
            user: []
        }
        res.status(400).json(response);
    } else {
        let userData = await handleCheckOTP(otp);

        const response: UserData = {
            errCode: userData.errCode,
            action: userData.action,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
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
            user: []
        };
        res.status(400).json(response);
    } else if (!/^[a-zA-Z\s]*$/.test(username)) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Invalid username entered!',
            user: []
        };
        res.status(400).json(response);
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Invalid email entered!',
            user: []
        };
        res.status(400).json(response);
    } else if (password.length < 8) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Password is too short!',
            user: []
        };
        res.status(400).json(response);
    } else {
        let userData = await handleUserRegister(username, email, password, cfPassword);

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
        };

        res.status(200).json(response);
    }
}

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    let { email, password } = req.body;

    if (!email || !password) {
        const errorResponse: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: []
        };
        res.status(400).json(errorResponse);
        return;
    }

    let userData = await handleUserLogin(email, password);

    if (userData.refreshToken) {
        refreshTokens.push(userData.refreshToken);
    }

    res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict", //Prevent CSOS attacks
    })

    const response: UserData = {
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : [],
        accessToken: userData.accessToken,
    };

    res.status(200).json(response);
};

export const handleForgetPasswordUser = async (req: Request, res: Response): Promise<void> => {
    let { email } = req.body;

    if (!email) {
        const errorResponse: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: []
        }
        res.status(400).json(errorResponse);
        return;
    } else {
        let userData = await handleForgetPassword(email);

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
        };

        res.status(200).json(response);
    }
}

export const handleResetPasswordUser = async (req: Request, res: Response): Promise<void> => {
    let { password, cfPassword } = req.body;

    if (!password || !cfPassword) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: []
        }
        res.status(400).json(response);
        return;
    } else if (password.length < 8) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Password is too short!',
            user: []
        };
        res.status(400).json(response);
    } else {
        let userData = await handleResetPassword(password, cfPassword);

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
        }

        res.status(200).json(response);
    }
}