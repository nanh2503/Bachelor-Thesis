import { Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    return res.status(statusCode).json({
        success: false,
        error: err.message
    })
}