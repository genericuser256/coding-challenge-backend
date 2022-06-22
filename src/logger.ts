import pino, { Bindings, LoggerOptions } from "pino";
import { isProdEnv, isTestEnv } from "./utils/node";

const prodOptions: LoggerOptions = {
    name: "base",
};

const testOptions: LoggerOptions = {
    // For now, though this might change in a real app,
    // have the testing logging be silent.
    name: "base",
    level: "silent",
};

const devOptions: LoggerOptions = {
    name: "base",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
};

const getLogger = () => {
    if (isProdEnv()) {
        // In a real situation we would want to have more configuration here
        // like redaction and perhaps different locations based on level
        // That would all be more involved, so for now, just write to a file
        return pino(prodOptions, pino.destination("./logs/app.log"));
    }

    if (isTestEnv()) {
        return pino(testOptions);
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

const baseLogger = getLogger();

export default baseLogger;
