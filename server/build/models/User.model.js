"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordreset: {
        type: Boolean,
        default: 0,
    },
    // active: {
    //     type: Boolean,
    //     required: true,
    //     default: false,
    // },
    active: {
        type: String,
        required: true,
        default: "Active"
    },
    role: {
        type: String,
        default: 'member',
        // required: true,
        // roles available to this proj: admin, member
    },
}, { timestamps: { createdAt: 'created_at' } });
const User = (0, mongoose_1.model)('users', UserSchema);
exports.default = User;
