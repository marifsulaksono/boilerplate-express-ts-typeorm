import { Request, Response, NextFunction } from "express";
import { CustomHttpExceptionError } from "../../lib/common/customError";
import { TokenJwtVerification } from "../../lib/auth/token";
import { MetadataToken } from "../../lib/types/token";

// initial request information into context / request interface
declare module 'express' {
    export interface Request {
        id: string;
        name: string;
        email: string;
    }
}

/*
	this middleware is for verifying token
	you can use this middleware in any route

    how to use:
    1. import VerifyJwtToken from "../../middleware/auth"
    2. app.use(VerifyJwtToken(prefixV1))

	more info contact me @marifsulaksono
*/
export function VerifyJwtToken(prefix: string) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // skip routes for verify
            const openRoutes = [
                `${prefix}/users`,
                `${prefix}/auth/login`,
            ];
            if (openRoutes.includes(req.path)) {
                return next();
            }
    
            // get authorization header
            const header = req.headers.authorization;
            if (!header) {
                throw new CustomHttpExceptionError('Token tidak valid', 401);
            }
            
            // split header by space
            const parts = header.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                throw new CustomHttpExceptionError('Format authorization tidak valid', 401);
            }
    
            // get and verify the jwt token
            const token = parts[1];
            const metadata: MetadataToken = await TokenJwtVerification(token, false);
            req.id = metadata.id;
            req.name = metadata.name;
            req.email = metadata.email;
            next();
        } catch (error) {
            next(error);
        }
    }
}
