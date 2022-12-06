"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const role_validator_1 = require("../validators/role.validator");
const router = (0, express_1.Router)();
router.patch('/update', role_validator_1.updateRoleSchema, error_validation_1.default, access_control_middleware_1.verifyToken, role_controller_1.updateRole);
router.post('/create', role_validator_1.createRoleSchema, error_validation_1.default, access_control_middleware_1.verifyToken, role_controller_1.createRole);
router.get('/', role_controller_1.getRoleList);
router.get('/:id', role_controller_1.getSingleRole);
router.delete('/:id', access_control_middleware_1.verifyToken, role_controller_1.deleteRole);
exports.default = router;
