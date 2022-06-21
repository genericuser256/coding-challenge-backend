import pino, { Bindings, LoggerOptions } from "pino";
import { isProdEnv } from "./utils/node";

const devOptions: LoggerOptions = {
    name: "base",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
};

const prodOptions: LoggerOptions = {
    name: "base",
};

const getLogger = (prod: boolean) => {
    if (prod) {
        // In a real situation we would want to have more configuration here
        // like redaction and perhaps different locations based on level
        // That would all be more involved, so for now, just write to a file
        return pino(prodOptions, pino.destination("./logs/app.log"));
    }

    return pino(devOptions);
};

export const getLoggerChild = (
    logger: ReturnType<typeof getLogger>,
    name: string,
    bindings: Bindings = {},
    options: LoggerOptions = {}
) => {
    return logger.child(bindings, { ...options, name });
};

const baseLogger = getLogger(isProdEnv());

export default baseLogger;
