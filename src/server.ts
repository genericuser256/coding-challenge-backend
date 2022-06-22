import { Server } from "http";
import { getDBConnection } from "./database";
import baseLogger from "./logger";
import { setupExpress } from "./express";

// Should be based on configuration file
const port = 4040;

export const start = async (): Promise<Server> => {
    await getDBConnection();
    const app = setupExpress();

    const server = app.listen(port, () => {
        baseLogger.info(`Example app listening at http://localhost:${port}`);
        return server;
    });
    return server;
};
