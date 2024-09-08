import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CustomHttpExceptionError } from "../../lib/common/customError";
import { ResponseErrorBuilder } from "../../lib/common/response";

/* eslint-disable @typescript-eslint/no-explicit-any */
function ValidatorMiddleware(type: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToInstance(type, req.body);
            const errors = await validate(dto);
    
            if (errors.length > 0) {
                const errorMessages = errors.map((error) => Object.values(error.constraints)).join(', ');
                throw new CustomHttpExceptionError(errorMessages, 400);
            }
    
            next();
        } catch (error) {
            ResponseErrorBuilder(res, error);
        }
    }
}

export default ValidatorMiddleware;