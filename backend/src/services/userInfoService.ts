import { UserInfoData } from "../controllers/userInfoController";
import UserInfo from "../models/userInfoModels";
import User from "../models/userModels";

export const handleSetUserInfoService = (email: string): Promise<UserInfoData> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfoData: UserInfoData = { errCode: -1, errMessage: '' };

            const isExistUser = await User.findOne({ 'email': email })

            if (!isExistUser) {
                userInfoData.errCode = 0;
                userInfoData.errMessage = 'User not found!';
            } else {
                const existUserInfo = await UserInfo.findOne({ 'email': email })
                userInfoData.userInfo = existUserInfo;
            }

            userInfoData.errCode = 0;
            userInfoData.errMessage = 'Fetch user info successful!';

            resolve(userInfoData)
        } catch (e) {
            reject(e)
        }
    })
}

export const handleUpdateUserInfoService = (email: string, avatar: string, username: string, birthDate: Date, phoneNum: string, gender: string): Promise<UserInfoData> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfoData: UserInfoData = { errCode: -1, errMessage: '' };

            const isExistUser = await User.findOne({ 'email': email })

            if (!isExistUser) {
                userInfoData.errCode = 0;
                userInfoData.errMessage = 'User not found!';
            } else {
                const existUserInfo = await UserInfo.findOne({ 'email': email })
                if (existUserInfo) {
                    existUserInfo.email = email;
                    existUserInfo.avatar = avatar;
                    existUserInfo.username = username;
                    existUserInfo.birthDate = birthDate;
                    existUserInfo.phoneNum = phoneNum;
                    existUserInfo.gender = gender;

                    await existUserInfo.save();
                    userInfoData.userInfo = existUserInfo;
                } else {
                    const newUserInfo = new UserInfo({
                        email: email,
                        username: username,
                    })

                    await newUserInfo.save();
                    userInfoData.userInfo = newUserInfo;
                }
            }

            userInfoData.errCode = 0;
            userInfoData.errMessage = 'Update user info successful!';

            resolve(userInfoData)
        } catch (e) {
            reject(e)
        }
    })
}