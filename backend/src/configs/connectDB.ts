import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const dbUrl = process.env.DATABASE_URL || '';
        console.log('Connection string:', dbUrl);
        await mongoose.connect(dbUrl)
        console.log('Connect to MongoDB successfully')
    } catch (err: any) {
        console.log(err)
    }
}
