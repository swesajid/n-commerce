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
exports.userForgotPassword = exports.loginUser = exports.createUser = exports.getUserInfo = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../config/logger"));
const error_util_1 = require("../utils/error.util");
//import Profile from '../models/Profile.model';
const NAMESPACE = "Auth Controller";
// Get User Info
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.api_user;
    try {
        const userFound = yield User_model_1.default.findById(user._id).select("_id name email username role ");
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)("No user found"));
        }
        res.json(userFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Get user info error", err);
        res.status(500).json((0, error_util_1.formatError)("Internal Server Error"));
    }
});
exports.getUserInfo = getUserInfo;
// Register User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(" req.body" ,  req.body);
    const { name, email, password, role } = req.body;
    const username = req.body.username ? req.body.username : email;
    try {
        const userFound = yield User_model_1.default.findOne({ email });
        if (userFound) {
            return res.status(400).json((0, error_util_1.formatError)("User exists!"));
        }
        // Hash Password
        const encrypted = yield bcrypt.hash(password, 10);
        const newUser = new User_model_1.default({
            name,
            email,
            username,
            password: encrypted,
            role,
        });
        const savedUser = yield newUser.save();
        // const newProfile = new Profile(
        // 	{
        // 		user: savedUser._id,
        // 	}
        // );
        // const savedProfile = await newProfile.save();
        const secret = process.env.API_SECRET;
        const token = yield jwt.sign({
            _id: savedUser._id,
            name,
            email,
            username,
            role: savedUser.role,
        }, secret);
        res.json({ token });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Create user error", err);
        res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.createUser = createUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        const userFound = email
            ? yield User_model_1.default.findOne({ email })
            : yield User_model_1.default.findOne({ username });
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)("Invalid credentials"));
        }
        const passwordMatched = yield bcrypt.compare(password, userFound.password);
        if (!passwordMatched) {
            return res.status(401).json((0, error_util_1.formatError)("Invalid credentials"));
        }
        if (userFound.active != "Active") {
            return res.status(404).json((0, error_util_1.formatError)("User is not active"));
        }
        const payload = {
            _id: userFound._id,
            email: userFound.email,
            username: userFound.username,
            name: userFound.name,
            role: userFound.role,
        };
        const secret = process.env.API_SECRET;
        const token = yield jwt.sign(payload, secret);
        res.json({ token, email: payload.email, name: payload.name });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Create User Error", err);
        res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.loginUser = loginUser;
// Forgot Password
const userForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userFound = yield User_model_1.default.findOne({ email }).select("_id firstname lastname email username role ");
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)("User not found"));
        }
        const payload = {
            _id: userFound._id,
            email: userFound.email,
            username: userFound.email,
            name: userFound.name,
            role: userFound.role,
        };
        const secret = process.env.API_SECRET;
        const token = yield jwt.sign(payload, secret);
        res.json({ token });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Forgot Password Error", err);
        res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.userForgotPassword = userForgotPassword;
