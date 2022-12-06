"use strict";
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
exports.deleteRole = exports.updateRole = exports.getSingleRole = exports.createRole = exports.getRoleList = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const Role_model_1 = __importDefault(require("../models/Role.model"));
const error_util_1 = require("../utils/error.util");
const NAMESPACE = 'Role Controller';
const getRoleList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_model_1.default.find({}).select('_id name description');
        res.json(roles);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error getting roles');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getRoleList = getRoleList;
// Create Event
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const user = req.body.api_user;
        const newRole = new Role_model_1.default({ name, description });
        yield newRole.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create role error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createRole = createRole;
const getSingleRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roleFound = yield Role_model_1.default.findById(id).select('_id name description');
        if (!roleFound) {
            return res.status(404).json((0, error_util_1.formatError)('Role not found'));
        }
        res.json(roleFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error getting role');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getSingleRole = getSingleRole;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleId, name, description } = req.body;
    try {
        const roleFound = yield Role_model_1.default.findById(roleId);
        if (!roleFound) {
            return res.status(404).json((0, error_util_1.formatError)('Role not found'));
        }
        const updated = yield Role_model_1.default.findByIdAndUpdate(roleId, { name, description });
        res.status(200).json({ msg: 'Updated role' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error updating role');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateRole = updateRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roleFound = yield Role_model_1.default.findById(id);
        if (!roleFound) {
            return res.status(404).json((0, error_util_1.formatError)('Role not found'));
        }
        const deleted = yield Role_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'Deleted role' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Error deleting role');
        return res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteRole = deleteRole;
