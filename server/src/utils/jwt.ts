import jwt from "jsonwebtoken";
import { env } from "../config/env"

export interface JwtPayload {
    userId: string;
};

export const signToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.jwt_secret, {
        expiresIn: (env.jwt_expire_in || '7d') as jwt.SignOptions['expiresIn'],
    });
}

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.jwt_secret) as JwtPayload;
};