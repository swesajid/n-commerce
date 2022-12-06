"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordValidSchema = exports.signupValidSchema = exports.loginValidSchema = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidSchema = [
    (0, express_validator_1.oneOf)([(0, express_validator_1.check)('email').exists({ checkFalsy: true }), (0, express_validator_1.check)('username').exists({ checkFalsy: true })], 'Must login with email or username'),
    // .optional()
    // .isEmail()
    // .if(body('username').isEmpty({ ignore_whitespace: true })),
    // .optional()
    // .if(body('email').isEmpty({ ignore_whitespace: true })),
    (0, express_validator_1.body)('password', 'Invalid password').isLength({ min: 5 }),
];
exports.signupValidSchema = [
    (0, express_validator_1.body)('name', 'First name is required').isString().optional(),
    (0, express_validator_1.body)('email', 'Email is required').isEmail().optional(),
    (0, express_validator_1.body)('role', 'Role is required').isString().optional(),
    (0, express_validator_1.body)('username').isString().optional(),
    (0, express_validator_1.body)('password', 'Password must be at least 6 characters').isLength({ min: 5 }).optional(),
];
exports.forgotPasswordValidSchema = [(0, express_validator_1.body)('email').isEmail()];
