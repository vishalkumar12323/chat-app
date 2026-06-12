import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export interface JwtPayload {
    userId: string;
};

export const signToken = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE_IN as jwt.SignOptions['expiresIn'] });
}

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};