"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RoleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: { createdAt: "created_at" } });
const Role = (0, mongoose_1.model)("roles", RoleSchema);
exports.default = Role;
