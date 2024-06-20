import mongoose from "mongoose";
import bcrypt from 'bcrypt';

export interface UserInterface {
    username: string;
    email: string;
    password: string;
    role: string;
}

const schema = new mongoose.Schema<UserInterface>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER'
    }
}, { timestamps: true });

const User = mongoose.models.user || mongoose.model<UserInterface>('user', schema);

// const saltRounds = 10;

// const createAdminUser = async () => {
//     const hashedPassword = await bcrypt.hash("admin@1234567890", saltRounds);

//     const newUser = new User({
//         username: "Admin2",
//         email: "admin2@gmail.com",
//         password: hashedPassword,
//         role: "ADMIN"
//     });

//     await newUser.save();
// }

// const createTestUsers = async () => {
//     for (let i = 1; i <= 20; i++) {
//         const username = `test${i}`;
//         const email = `test${i}@gmail.com`;
//         const password = await bcrypt.hash("1234567890", saltRounds);

//         const newUser = new User({
//             username,
//             email,
//             password,
//             role: "USER"
//         });

//         await newUser.save();
//     }
// }

// const initializeUsers = async () => {
//     try {
//         await createTestUsers(); ``
//         console.log("20 test users created successfully");
//     } catch (error) {
//         console.error("Error creating users:", error);
//     }
// }

// initializeUsers();

export default User;
