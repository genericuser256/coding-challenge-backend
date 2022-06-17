export const isProdEnv = () => {
    return process.env.NODE_ENV === "prod";
};

export const isDevEnv = () => {
    return process.env.NODE_ENV === "dev";
};

export const isTestEnv = () => {
    return process.env.NODE_ENV === "test";
};
