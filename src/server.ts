import express, { json, Express } from "express";
import { Server } from "http";
import errorHandler from "strong-error-handler";
import morgan from "morgan";
import cors from "cors";
import { getDBConnection } from "./database";
import { setupRoutes } from "./routes";
import { isProdEnv } from "./utils/node";

// Should be based on configuration file
const port = 4040;

// This is essentially the Apache combined log format with response time as well
const prodLogFormat =
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

const setupMiddleware = (app: Express) => {
    app.use(
        errorHandler({
            // Normally this would be based on configuration as well
            debug: !isProdEnv(),
            log: true,
        })
    );

    // Normally this would be based on configuration as well
    app.use(morgan(isProdEnv() ? prodLogFormat : "dev"));

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

const setupExpress = () => {
    const app = express();

    setupMiddleware(app);
    setupRoutes(app);

    const server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        return server;
    });
    return server;
};

export const start = async (): Promise<Server> => {
    try {
        const db = await getDBConnection();
        await db.sync({ force: true });
        return setupExpress();
    } catch (err) {
        throw err;
    }
};
