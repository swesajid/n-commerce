"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubOnly = exports.adminOnly = exports.verifyToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../config/logger"));
const error_util_1 = require("../utils/error.util");
const NAMESPACE = "Access-Control Middleware";
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["skon-auth-token"];
        if (!token) {
            return res.status(401).send((0, error_util_1.formatError)("Access denied"));
        }
        const token_verified = yield jwt.verify(token, process.env.API_SECRET);
        if (token_verified) {
            const decoded = yield jwt.decode(token);
            req.body.api_user = decoded;
            next();
        }
        else {
            return res.status(401).send((0, error_util_1.formatError)("Access denied"));
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Token Error", err);
        return res.status(401).send((0, error_util_1.formatError)("Access denied"));
    }
});
exports.verifyToken = verifyToken;
const adminOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.api_user;
        const role = user.role;
        if (role !== "admin") {
            return res.status(401).send((0, error_util_1.formatError)("Access denied"));
        }
        next();
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Admin middleware error", err);
        return res.status(401).send((0, error_util_1.formatError)("Access denied"));
    }
});
exports.adminOnly = adminOnly;
const clubOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.api_user;
        const role = user.role;
        if (role !== "customer") {
            return res.status(401).send((0, error_util_1.formatError)("Access denied"));
        }
        next();
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Admin middleware error", err);
        return res.status(401).send((0, error_util_1.formatError)("Access denied"));
    }
});
exports.clubOnly = clubOnly;
