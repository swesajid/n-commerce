"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warning = exports.info = void 0;
const info = (namespace, message, object) => {
    if (object) {
        console.info(`[${namespace}] - [INFO] ${message} - [Object] - `, object);
    }
    else {
        console.info(`[${namespace}] - [INFO] ${message}`);
    }
};
exports.info = info;
const warning = (namespace, message, object) => {
    if (object) {
        console.warn(`[${namespace}] - [INFO] ${message} - [Object] - `, object);
    }
    else {
        console.warn(`[${namespace}] - [INFO] ${message}`);
    }
};
exports.warning = warning;
const error = (namespace, message, object) => {
    if (object) {
        console.warn(`[${namespace}] - [INFO] ${message} - [Object] - `, object);
    }
    else {
        console.warn(`[${namespace}] - [INFO] ${message}`);
    }
};
exports.error = error;
exports.default = { info: exports.info, error: exports.error, warning: exports.warning };
