import { NextFunction, Request, Response } from "express";
import { NotFoundException, Exception } from "@exceptions";
import { env, Logger } from "@providers";
import { Express } from "express";

class ErrorHandlerMiddleware {
    public catch(express: Express) {
        express.all("*", (req: Request, res: Response, next: NextFunction) => {
            next(new NotFoundException("This route does not exist."));
        });
    }

    public logger(err: Error, req: Request, res: Response, next: NextFunction) {
        err.stack && Logger.error(err.stack);
        return next(err);
    }

    public handler(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        if (err instanceof Exception) {
            Logger.error(
                `${
                    req.headers["x-forwarded-for"] || req.socket.remoteAddress
                } ${req.method} ${req.originalUrl} ${
                    err.status
                } "${JSON.stringify({
                    message: err.message,
                    ...(err.stack != null && { stack: err.stack }),
                })}"`,
            );
            return res.status(err.status).json(err.json());
        } else {
            const exception = new Exception(
                500,
                env.isDevelopment ? err.message : undefined,
                err.stack,
            );
            Logger.error(
                `${
                    req.headers["x-forwarded-for"] || req.socket.remoteAddress
                } ${req.method} ${req.originalUrl} ${
                    exception.status
                } "${JSON.stringify({
                    message: exception.message,
                    ...(exception.stack != null && {
                        stack: exception.stack,
                    }),
                })}"`,
            );
            return res.status(exception.status).json(exception.json());
        }
    }
}

export default new ErrorHandlerMiddleware();
