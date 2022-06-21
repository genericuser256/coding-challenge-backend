import { Express } from "express";
import { eventsRouter } from "./events";

export const setupRoutes = (app: Express) => {
    app.use("/events", eventsRouter);

    return app;
};
