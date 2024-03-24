import { Request, Response } from "express";
import { UserInfoInterface } from "../models/userInfoModels";
import { handleSetUserInfoService } from "../services/userInfoServices";

export interface UserInfoData {
    errCode: number;
    errMessage: string;
    userInfo?: Partial<UserInfoInterface>;
}

export const handleSetUserInfoController = async (req: Request, res: Response): Promise<void> => {
    let { email, avatar, username, birthDate, phoneNum, gender } = req.body;

    console.log(req.body);

    let userInfoData = await handleSetUserInfoService(email, avatar, username, birthDate, phoneNum, gender);

    const response: UserInfoData = {
        errCode: userInfoData.errCode,
        errMessage: userInfoData.errMessage,
        userInfo: userInfoData.userInfo ? userInfoData.userInfo : {}
    };

    res.status(200).json(response);
}