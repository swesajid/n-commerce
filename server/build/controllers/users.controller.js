"use strict";
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
exports.updatePassword = exports.updateAccount = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getUserList = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const User_model_1 = __importDefault(require("../models/User.model"));
const error_util_1 = require("../utils/error.util");
const bcrypt = __importStar(require("bcryptjs"));
const data_formate_1 = require("../common/data-formate");
const NAMESPACE = 'User Controller';
const getUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_model_1.default.find({}).select('_id name email username role active ');
        res.json(users);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error getting users');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getUserList = getUserList;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userFound = yield User_model_1.default.findById(id).select('_id name email username role active ');
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)('User not found'));
        }
        let data = (0, data_formate_1.dataFormate)(data_formate_1.UserTableFormateObj, userFound, false);
        res.json(data);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error getting user');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, email, username, active, role } = req.body;
    try {
        const userFound = yield User_model_1.default.findById(_id);
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)('User not found'));
        }
        const updated = yield User_model_1.default.findByIdAndUpdate(_id, { name, email, username, active, role });
        res.status(200).json({ msg: 'Updated user' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error updating user');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userFound = yield User_model_1.default.findById(id);
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)('User not found'));
        }
        const deleted = yield User_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'Deleted user' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error deleting user');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteUser = deleteUser;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, name, email, username, role } = req.body;
        const api_user = req.body.api_user;
        const userFound = yield User_model_1.default.findById(_id);
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)('User not found'));
        }
        if (userFound._id.toString() !== api_user._id) {
            return res.status(404).json((0, error_util_1.formatError)('You can only change the account of your own.'));
        }
        const updated = yield User_model_1.default.findByIdAndUpdate(_id, { name, email, username, role });
        res.json({ msg: 'Updated account' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error updating user account', err);
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateAccount = updateAccount;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, prev_password, password, reenter_password } = req.body;
        const api_user = req.body.api_user;
        const userFound = yield User_model_1.default.findById(_id);
        if (!userFound) {
            return res.status(404).json((0, error_util_1.formatError)('User not found'));
        }
        if (userFound._id.toString() !== api_user._id) {
            return res.status(404).json((0, error_util_1.formatError)('You can only change account password of your own.'));
        }
        const passwordMatched = yield bcrypt.compare(prev_password, userFound.password);
        if (!passwordMatched) {
            return res.status(401).json((0, error_util_1.formatError)("Previous Password doesn't match"));
        }
        if (password !== reenter_password) {
            return res.status(401).json((0, error_util_1.formatError)("Password and Re-type password doesn't match"));
        }
        // Hash Password
        const encrypted = yield bcrypt.hash(password, 10);
        const updated = yield User_model_1.default.findByIdAndUpdate(_id, { password: encrypted });
        res.json({ msg: 'Password updated ' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error updating user password', err);
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updatePassword = updatePassword;
