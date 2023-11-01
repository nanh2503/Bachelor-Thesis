import User from "../models/userModels";

interface User{
    email: string,
    password: string
}

export interface UserData{
    errCode: number,
    errMessage: string,
    user?: User,
}

export const handleUserLogin = (email: string, password: string): Promise<UserData> => {
    return new Promise(async (resolve, reject)=>{
        try{
            let userData: UserData = {errCode: -1, errMessage: ''};
            let isExist = await checkUserEmail(email)
            if(isExist){
                let user = await User.findOne({email: email})
                if(user){
                    let check = (password === user.password ? 'true' : 'false')
                    if(check === 'true'){
                        userData.errCode = 0,
                        userData.errMessage = 'Login success',
                        userData.user = user
                    }else{
                        userData.errCode = 3,
                        userData.errMessage = 'Password is not true'
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = "User is not found";
                }
            }else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "Your Email isn't exist in the system. Please try again!";
        }
        resolve(userData)
    }catch(e){
        reject(e)
    }
    })
}

let checkUserEmail = (email: string) => {
    return new Promise(async(resolve, reject)=>{
        try{
            let user = await User.findOne({email: email})
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }catch(e){
            reject(e)
        }
    })
}