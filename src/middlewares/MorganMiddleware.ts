import morgan from "morgan";
import { Morgan as MorganProvider } from "@providers";
import { Express } from "express";

class MorganMiddleware {
    public mount(express: Express) {
        express.use(
            morgan(
                ":remote-addr :method :url :status :res[content-length] - :response-time ms",
                {
                    stream: MorganProvider.stream(),
                    skip: MorganProvider.skip(),
                },
            ),
        );
    }
}

export default new MorganMiddleware();
