import { Request, Response } from "express";
import { handleCheckOTP, handleDeleteUserService, handleForgetPassword, handleGetUserService, handleResetPassword, handleUserLogin, handleUserRegister } from "../services/userServices";
import jwt from 'jsonwebtoken';
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

export const handleGetUser = async (req: Request, res: Response): Promise<void> => {
    const arg = req.query.arg || "";
    console.log('check arg: ', arg);

    if (!arg) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'Missing inputs parameter!',
            user: []
        }
        res.status(400).json(response);
        return;
    } else {
        let userData = await handleGetUserService(arg.toString());

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
        }

        res.status(200).json(response);
    }
}

export const handleDeleteUser = async (req: Request, res: Response): Promise<void> => {
    let { _id } = req.query;

    if (!_id) {
        const response: UserData = {
            errCode: 1,
            errMessage: 'User email is required!',
            user: []
        }
        res.status(400).json(response);
        return;
    } else {
        const userData = await handleDeleteUserService(_id.toString());

        const response: UserData = {
            errCode: userData.errCode,
            errMessage: userData.errMessage,
            user: userData.user ? userData.user : []
        }

        res.status(200).json(response);
    }
}

export const requestRefreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) res.status(401).json('You are not authenticated.');
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json("Refresh token is not valid.");
        return;
    }
    const accessKey = process.env.JWT_ACCESS_KEY
    const refreshKey = process.env.JWT_ACCESS_KEY
    if (refreshKey && accessKey) {
        jwt.verify(refreshToken, refreshKey, (err: jwt.VerifyErrors | null, user: any) => {
            if (err) {
                console.error(err);
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            //Create new accessToken, refreshToken
            const newAccessToken = jwt.sign(
                {
                    id: user.id,
                    admin: user.admin
                },
                accessKey,
                { expiresIn: "2h" }
            );

            const newRefreshToken = jwt.sign(
                {
                    id: user.id,
                    admin: user.admin
                },
                refreshKey,
                { expiresIn: "365d" }
            )

            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict", //ngăn chặn tấn công CSOS
            })

            res.status(200).json({ accessToken: newAccessToken });
        })
    }
}
