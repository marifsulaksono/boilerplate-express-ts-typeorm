import { CustomError } from "../types/error";

export class CustomHttpExceptionError extends Error {
    public statusCode: number;
    public detailError: CustomError;
  
    constructor(message: string, code: number, error?: Error) {
      super(message);
      this.statusCode = code || 500;
      this.detailError = error as CustomError;
    }
}
