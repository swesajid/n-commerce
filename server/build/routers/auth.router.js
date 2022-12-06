"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const router = (0, express_1.Router)();
router.get('/', access_control_middleware_1.verifyToken, auth_controller_1.getUserInfo);
router.post('/forgot-password', auth_validator_1.forgotPasswordValidSchema, error_validation_1.default, auth_controller_1.userForgotPassword);
router.post('/register', auth_validator_1.signupValidSchema, error_validation_1.default, auth_controller_1.createUser);
router.post('/login', auth_validator_1.loginValidSchema, error_validation_1.default, auth_controller_1.loginUser);
exports.default = router;
