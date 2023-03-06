import { Express, Logger } from "@providers";

(async () => {
    process.on("uncaughtException", (exception) => {
        Logger.error("Stopping server due to error:", exception);
        process.exit(1);
    });
    process.on("warning", (warning) => Logger.warn(warning.stack));

    try {
        new Express().listen();
    } catch (err) {
        Logger.error("Stopping server due to error:", err);
        process.exit(1);
    }
})();
