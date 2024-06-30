import { Request, Response } from "express";
import { handleDeleteUserService, handleGetUserService } from "../services/userService";
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
            errMessage: 'User id is required!',
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
