import { UserData } from "../controllers/userController";
import User from "../models/userModels";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import UserOTPVerification from "../models/UserOTPVerification";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { OAuth2Client } from 'google-auth-library';

let tempAcc: { email: string, username: string, password: string } = {
    email: '',
    username: '',
    password: ''
}

const sendOTPVerificationEmail = async (email: string) => {
    try {
        const oAuth2CLient = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
        oAuth2CLient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

        const accessToken = await oAuth2CLient.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            },
        } as SMTPTransport.Options);

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        // hash the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        let userOTP = await UserOTPVerification.findOne({ email: email })
        if (userOTP) {
            userOTP.otp = hashedOTP,
                userOTP.createAt = new Date(),
                userOTP.expiresAt = new Date(Date.now() + 3600000),

                await userOTP.save();
        } else {
            const newOTPVerification = await new UserOTPVerification({
                email: email,
                otp: hashedOTP,
                createAt: new Date(),
                expiresAt: new Date(Date.now() + 3600000),
            });

            // save otp record
            await newOTPVerification.save();
        }

        await transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'VERIFY YOUR EMAIL',
            html: `<p style="text-align: center;"><strong style="font-size: 25px; margin:40px 0;">Email Verification</strong></p>
            <p>It seems you are registering at NAUIV website and trying to verify your email.</p>
            <p>Here is the verification code. Please copy it and verify your Email.</p>
            <p style="text-align: center; background-color: #e2ebff"><strong style="font-size: 25px; padding: 20px; margin:20px 0;"">code: ${otp}</strong></p>
            <p>If this email is not intended to you please ignore and delete it. Thank you for understanding.</p>`
        })
    } catch (err) {
        console.error(err);
    }
}

export const handleCheckOTP = (otp: string): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData: UserData = { errCode: -1, errMessage: '', action: '' }

            let userOTP = await UserOTPVerification.findOne({ email: tempAcc.email })
            let existUser = await checkUserEmail(tempAcc.email);
            if (userOTP) {
                const checkOTP = await bcrypt.compare(otp, userOTP.otp)

                if (checkOTP) {
                    if (!existUser) {
                        //hash the password
                        const saltRounds = 10;
                        const hashedPassword = await bcrypt.hash(tempAcc.password, saltRounds);

                        const newUser = new User({
                            username: tempAcc.username,
                            email: tempAcc.email,
                            password: hashedPassword,
                        })

                        await newUser.save();

                        userData.errCode = 0;
                        userData.action = 'register';
                        userData.errMessage = 'Registration successful!';
                        userData.user = newUser.toObject();
                    } else {
                        userData.errCode = 0;
                        userData.action = 'reset-password';
                        userData.errMessage = 'Verify OTP successful!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'This OTP is not true. Please try again!';
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = 'This email is not exist. Please try again!';
            }

            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

export const checkUserEmail = (email: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ email: email })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

export const handleUserRegister = (username: string, email: string, password: string, cfPassword: string): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData: UserData = { errCode: -1, errMessage: '' };
            let isExist = await checkUserEmail(email)
            if (!isExist) {
                if (password === cfPassword) {
                    tempAcc.email = email;
                    tempAcc.username = username;
                    tempAcc.password = password;

                    try {
                        await sendOTPVerificationEmail(email);

                        userData.errCode = 0;
                        userData.errMessage = 'Verification OTP email sent';
                        return resolve(userData);
                    } catch (err) {
                        console.error(err);
                        userData.errCode = 1;
                        userData.errMessage = 'An error occurred while send OTP mail';
                        return resolve(userData);
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "Password and confirm password are not the same.";
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "This Email already exists in the system. Please use another email!";
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

export const handleUserLogin = (email: string, password: string): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData: UserData = { errCode: -1, errMessage: '' };
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await User.findOne({ email: email })
                if (user) {
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0,
                            userData.errMessage = 'Login success',
                            userData.user = user
                    } else {
                        userData.errCode = 3,
                            userData.errMessage = 'Password is not true'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User is not found";
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "Your Email isn't exist in the system. Please try again!";
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

export const handleForgetPassword = (email: string): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData: UserData = { errCode: -1, errMessage: '' };
            let isExist = await checkUserEmail(email);

            if (isExist) {
                tempAcc.email = email;
                try {
                    await sendOTPVerificationEmail(email);

                    userData.errCode = 0;
                    userData.errMessage = 'Verification OTP email sent';
                    return resolve(userData);
                } catch (err) {
                    console.error(err);
                    userData.errCode = 1;
                    userData.errMessage = 'An error occurred while send OTP mail';
                    return resolve(userData);
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "This email is not exist in the system. Please try again!";
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

export const handleResetPassword = (password: string, cfPassword: string): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData: UserData = { errCode: -1, errMessage: '' }

            let existUser = await User.findOne({ email: tempAcc.email });

            if (password === cfPassword) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                existUser.password = hashedPassword;

                await existUser.save();

                userData.errCode = 0;
                userData.errMessage = 'Reset password successfully!';
            } else {
                userData.errCode = 2;
                userData.errMessage = "Password and confirm password are not the same.";
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}



