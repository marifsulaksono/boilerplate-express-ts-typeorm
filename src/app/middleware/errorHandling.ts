import { NextFunction, Request, Response } from "express";
import { CustomHttpExceptionError } from "../../lib/common/customError";
import { ResponseErrorBuilder } from "../../lib/common/response";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const ErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    console.log(new Date(), '=> "' + req.originalUrl + '" use method: "' + req.method + '", unexprected error:', err.message)
    if (err instanceof CustomHttpExceptionError) {
        ResponseErrorBuilder(res, err);
    } else {
        const error = new CustomHttpExceptionError('Internal Server Error', 500, err);
        ResponseErrorBuilder(res, error);
    }
};

export default ErrorHandler;