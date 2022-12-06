"use strict";
/** @format */
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
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const dotenv_1 = require("dotenv");
const db_config_1 = require("./config/db.config");
const logger_1 = __importDefault(require("./config/logger"));
const cors_1 = __importDefault(require("cors"));
const NAMESPACE = "Server";
(0, dotenv_1.config)();
const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT;
const nextApp = (0, next_1.default)({ dev });
const handle = nextApp.getRequestHandler();
const request = require("request-promise-native");
const app = (0, express_1.default)();
// Routers
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const users_router_1 = __importDefault(require("./routers/users.router"));
nextApp
    .prepare()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    (0, db_config_1.connectDB)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use("/api/auth", auth_router_1.default);
    app.use("/api/users", users_router_1.default);
    app.get("*", (req, res) => handle(req, res));
    app.listen(PORT, () => logger_1.default.info(NAMESPACE, `Server running in port --> ${PORT}`));
}))
    .catch((reason) => console.log(reason));
