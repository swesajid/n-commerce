"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const formatError = (msg) => ({
    errors: [
        {
            msg,
        },
    ],
});
exports.formatError = formatError;
