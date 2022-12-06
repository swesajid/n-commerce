"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createRoleSchema = [
    (0, express_validator_1.body)('name', 'Role name is required').isString(),
    (0, express_validator_1.body)('description', 'Role description is required').isString(),
];
exports.updateRoleSchema = [
    (0, express_validator_1.body)('roleId', 'Role ID is required').isString(),
    (0, express_validator_1.body)('name', 'Role name is required').isString().optional(),
    (0, express_validator_1.body)('description', 'Role description is required').isString().optional(),
];
