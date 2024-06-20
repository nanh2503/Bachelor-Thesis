import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const dbUrl = process.env.DATABASE_URL || '';
        if (!dbUrl) {
            throw new Error("DATABASE_URL is not defined in the environment variable");
        }

        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });

        const db = mongoose.connection;

        db.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        db.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        db.on('disconnected', () => {
            console.log('Mongoose disconnected from DB');
        });
    } catch (err: any) {
        console.error('MongoDB connection error:', err);
    }
}
