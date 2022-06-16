import express from "express";
import { Server } from "http";
import { getDBConnection } from "./database";

export const start = async (): Promise<Server> => {
    try {
        const port = 4040;
        const app = express();
        const db = await getDBConnection();
        await db.sync({ force: true });
        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        const server = app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
            return server;
        });
        return server;
    } catch (err) {
        throw err;
    }
};
