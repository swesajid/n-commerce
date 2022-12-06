"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.createProfileSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createProfileSchema = [
    (0, express_validator_1.body)('club_name', 'Club/School name is required').isString(),
    (0, express_validator_1.body)('nccp_number', 'NCCP number is required').isString(),
    (0, express_validator_1.body)('club_number', 'Club number is required').isString(),
    (0, express_validator_1.body)('about_us', 'About us is required').isString(),
    (0, express_validator_1.body)('contact_name', 'Contact name is required').isString(),
    (0, express_validator_1.body)('address', 'Address is required').isString(),
    (0, express_validator_1.body)('tel', 'Tel is required').isString(),
    (0, express_validator_1.body)('email', 'Email is required').isString(),
];
exports.updateProfileSchema = [
    (0, express_validator_1.body)('club_name', 'Club/School name is required').isString(),
    (0, express_validator_1.body)('nccp_number', 'NCCP number is required').isString(),
    (0, express_validator_1.body)('club_number', 'Club number is required').isString(),
    (0, express_validator_1.body)('about_us', 'About us is required').isString(),
    (0, express_validator_1.body)('excellencedetails', 'Can skate excellence details is required').isString().optional(),
    (0, express_validator_1.body)('contact_name', 'Contact name is required').isString(),
    (0, express_validator_1.body)('address', 'Address is required').isString(),
    (0, express_validator_1.body)('tel', 'Tel is required').isString(),
    (0, express_validator_1.body)('email', 'Email is required').isString(),
];
