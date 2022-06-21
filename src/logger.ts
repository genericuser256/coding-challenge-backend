import pino, { LoggerOptions } from "pino";
import { isProdEnv } from "./utils/node";

const devOptions: LoggerOptions = {
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
};

const prodOptions: LoggerOptions = {};

const getLogger = (prod: boolean) => {
    if (prod) {
        // In a real situation we would want to have more configuration here
        // like redaction and perhaps different locations based on level
        // That would all be more involved, so for now, just write to a file
        return pino(prodOptions, pino.destination("./logs/app.log"));
    }

    return pino(devOptions);
};

const logger = getLogger(isProdEnv());

export default logger;
