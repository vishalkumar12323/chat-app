import { JwtPayload } from '../utils/jwt';
import { Request } from "express"

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

