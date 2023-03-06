import { Logger, env } from "@providers";
import { Request, Response } from "express";

class Morgan {
    public stream() {
        return {
            write: (message: string) => Logger.http(message.trim()),
        };
    }

    public skip() {
        return (req: Request, res: Response) => {
            return !env.isDevelopment || res.statusCode >= 400;
        };
    }
}

export default new Morgan();
