import express, { json, Express } from "express";
import errorHandler from "strong-error-handler";
import cors from "cors";
import { eventsRouter } from "./routes";
import { isProdEnv } from "./utils/node";
import PinoHttp from "pino-http";
import baseLogger from "./logger";

const httpLogger = PinoHttp({
    logger: baseLogger,
});

const setupMiddleware = (app: Express) => {
    app.use(httpLogger);

    // middleware for json body parsing
    app.use(json({ limit: "5mb" }));

    app.use(
        cors({
            allowedHeaders: ["Content-Type", "authorization"],
            methods: ["GET", "POST"],
            // This isn't how it usually would be setup, but for this context just assume that all
            // requests will be coming from inside the same house!
            origin: isProdEnv() ? "localhost" : "*",
        })
    );
};

const setupRoutes = (app: Express) => {
    app.use("/events", eventsRouter);
};

export const setupExpress = () => {
    const app = express();

    setupMiddleware(app);
    setupRoutes(app);

    app.use(
        errorHandler({
            // Normally this would be based on configuration
            debug: !isProdEnv(),
            log: false,
        })
    );

    return app;
};
