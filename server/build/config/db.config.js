"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
const NAMESPACE = 'Database';
const connectDB = () => {
    const url = process.env.DATABASE_URL;
    mongoose_1.default.connect(url);
    const db = mongoose_1.default.connection;
    db.on('error', (err) => (0, logger_1.error)(NAMESPACE, 'Connection Problem', err));
    db.once('open', () => (0, logger_1.info)(NAMESPACE, 'Connected to Mongodb'));
};
exports.connectDB = connectDB;
