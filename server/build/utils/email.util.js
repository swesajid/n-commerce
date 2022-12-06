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
exports.sendEmailFromTemplate = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../config/logger"));
const sparkPostTransport = require("nodemailer-sparkpost-transport");
const NAMESPACE = "Mail utility";
const sendEmailFromTemplate = (mailProps) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const transporter = nodemailer.createTransport({
        //     host: process.env.SMTP_HOST,
        //     port: parseInt(process.env.SMTP_PORT as string),
        //     secure: false,
        //     auth: {
        //         user: process.env.SMTP_USER,
        //         pass: process.env.SMTP_PASSWORD,
        //     },
        // });
        const transporter = nodemailer_1.default.createTransport(sparkPostTransport({
            sparkPostApiKey: process.env.SPARKPOST_API_KEY,
        }));
        const handlebarsOptions = {
            viewEngine: {
                partialsDir: path_1.default.resolve("server", "templates", "emails"),
                defaultLayout: false,
            },
            viewPath: path_1.default.resolve("server", "templates", "emails"),
        };
        transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(handlebarsOptions));
        const { to, subject, template, context } = mailProps;
        const message = {
            to,
            from: process.env.SMTP_FROM,
            subject,
            template,
            context,
        };
        const mailres = yield transporter.sendMail(message);
        return true;
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Error sending mail", err);
        return false;
    }
});
exports.sendEmailFromTemplate = sendEmailFromTemplate;
