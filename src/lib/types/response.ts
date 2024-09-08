/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponsePayload {
    responseCode: number;
    responseDesc: string;
    timestamp: Date;
    data: any;
    message: string;
}