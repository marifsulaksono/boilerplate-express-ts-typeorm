import { NextFunction, Request, Response } from "express";
import { CustomHttpExceptionError } from "../../lib/common/customError";
import { ResponseErrorBuilder } from "../../lib/common/response";

/*
	this middleware is used for custom error handling response

    how to use:
    1. import ErrorHandler from "../../middleware/errorHandling"
    2. app.use(ErrorHandler)

	more info contact me @marifsulaksono
*/

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