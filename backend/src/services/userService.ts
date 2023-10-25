import db from "../models/index";
import bcrypt from 'bcryptjs';

/**format to hash password */
const salt = bcrypt.genSaltSync(10);

/**hash user password */
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

/**login function */
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {

                //users already exist
                let users = await db.users.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'password', 'fullname'],
                    raw: true
                });
                if (users) {
                    //compare password
                    let check = await bcrypt.compareSync(password, users.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Login success';
                        delete users.password;   //Ẩn password 
                        userData.users = users;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Password is not true';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "users is not found";

                }

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "Your Email isn't exist in the system. Please try again!";

            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

/**check user email */
let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.users.findOne({
                where: { email: email }
            })
            if (users) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

/**get all users from table by id
 * if id='All' => get all users
 * if id!='All' => get one user by userId
 */
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'All') {
                users = await db.users.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.users.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

/**create a new user */
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist?
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'This email is already used. Please try another email!'
                })

            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.users.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    fullname: data.fullname,
                    code: data.code,
                    node: data.node,
                    phonenum: data.phonenum,
                    image: data.image
                })

                resolve({
                    errCode: 0,
                    message: 'Successfully'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

/**delete user by id */
let deleteUser = (idInput) => {
    return new Promise(async (resolve, reject) => {
        let users = await db.users.findOne({
            where: { id: idInput }
        })

        if (!users) {
            resolve({
                errCode: 2,
                errMessage: 'The users is not exist'
            })
        }

        //delete user
        await db.users.destroy({
            where: { id: idInput }
        })
        resolve({
            errCode: 0,
            message: 'The users is deleted'
        })
    })
}

/**update user by id after edit */
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing requied parameters"
                })
            }
            let users = await db.users.findOne({
                where: { id: data.id },
                raw: false
            })
            if (users) {
                users.email = data.email;
                users.fullname = data.fullname;
                users.phonenum = data.phonenum;
                users.code = data.code;
                users.node = data.node;
                if (data.image) {
                    users.image = data.image;
                }

                await users.save();

                resolve({
                    errCode: 0,
                    message: 'Update the users successful!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'users is not found!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

/**export all functions */
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
}