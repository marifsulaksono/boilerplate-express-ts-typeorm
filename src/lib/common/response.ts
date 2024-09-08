import { RESPONSE_FAILED_DESC, RESPONSE_SUCCESS_DESC } from "../constants/response";
import { ResponsePayload } from "../types/response";
import { CustomHttpExceptionError } from "./customError";
import { Response } from "express";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ResponseSuccessBuilder(res: Response, code: number, message?: string | undefined, data?: any) {
    responseBuilder(res, RESPONSE_SUCCESS_DESC, code, message, data)
}

export function ResponseErrorBuilder(res: Response, err: any) {
    if (err.statusCode === undefined ) {
        err = new CustomHttpExceptionError('Internal Server Error', 500, err)
    }
    const error = err as CustomHttpExceptionError;
    const {statusCode, message, detailError} = error
    const errMessage = detailError ? detailError.message : null;
    responseBuilder(res, RESPONSE_FAILED_DESC, statusCode, message, errMessage)
}

function responseBuilder(res: Response, desc: string, statusCode: number, message?: string, data?: any) {
    const isEmptyObject = (obj: object) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    const payload: ResponsePayload = {
        responseCode: statusCode,
        responseDesc: desc,
        timestamp: new Date(),
        data: isEmptyObject(data) ? null : data,
        message: message as string
    }
    res.status(statusCode).send(payload)
}