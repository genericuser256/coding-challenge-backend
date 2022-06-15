import express from "express";
import { Server } from "http";
import { getDBConnection } from "./database";

export const start = async (): Promise<Server> =>
    new Promise(async (resolve, reject) => {
        try {
            const port = 4040;
            const app = express();
            getDBConnection();
            app.get("/", (req, res) => {
                res.send("Hello World!");
            });

            const server = app.listen(port, () => {
                console.log(
                    `Example app listening at http://localhost:${port}`
                );
                resolve(server);
            });
        } catch (err) {
            reject(err);
        }
    });
