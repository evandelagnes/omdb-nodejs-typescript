import httpStatus from "http-status";
import { IException } from "@interfaces";
import { env } from "@providers";

export class Exception implements IException {
    message: string | undefined;
    stack: string | undefined;
    status: number;

    constructor(status: number, message?: string, stack?: string) {
        this.message = message;
        this.status = status;
        this.stack = stack;
    }

    public json(): {
        status: number;
        type: string;
        message?: string;
    } {
        return {
            status: this.status,
            type: <string>httpStatus[`${this.status.toString()}_NAME`],
            ...(this.message != null &&
                this.message.length > 0 && { message: this.message }),
            ...(env.isDevelopment &&
                this.stack != null && { stack: this.stack }),
        };
    }
}
