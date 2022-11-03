export const info = (
    namespace: string,
    message: string,
    object?: any
): void => {
    if (object) {
        console.info(
            `[${namespace}] - [INFO] ${message} - [Object] - `,
            object
        );
    } else {
        console.info(`[${namespace}] - [INFO] ${message}`);
    }
};

export const warning = (
    namespace: string,
    message: string,
    object?: Object
): void => {
    if (object) {
        console.warn(
            `[${namespace}] - [INFO] ${message} - [Object] - `,
            object
        );
    } else {
        console.warn(`[${namespace}] - [INFO] ${message}`);
    }
};

export const error = (
    namespace: string,
    message: string,
    object?: Object
): void => {
    if (object) {
        console.warn(
            `[${namespace}] - [INFO] ${message} - [Object] - `,
            object
        );
    } else {
        console.warn(`[${namespace}] - [INFO] ${message}`);
    }
};

export default { info, error, warning };
