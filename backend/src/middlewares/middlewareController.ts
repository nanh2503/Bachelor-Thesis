import jwt from 'jsonwebtoken';
import { UserInterface } from '../models/userModels';
import { Request, Response, NextFunction } from 'express';

const middlewareController = {
    verifyToken: (req: Request & { user?: UserInterface }, res: Response, next: NextFunction) => {
        const token = req.headers.token as string;
        const accessTokenKey = process.env.JWT_ACCESS_KEY;

        if (token && accessTokenKey) {
            const accessToken = token.split(" ")[1];
            try {
                const user = jwt.verify(accessToken, accessTokenKey) as UserInterface;
                req.user = user;
                next();
            } catch (err) {
                res.status(403).json("Token is not valid");
            }
        } else {
            res.status(401).json("You are not authenticated");
        }
    }
};

export default middlewareController;
