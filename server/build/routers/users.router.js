"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const router = (0, express_1.Router)();
router.get("/", users_controller_1.getUserList);
router.patch("/update", users_controller_1.updateUser);
router.patch("/update-account", access_control_middleware_1.verifyToken, users_controller_1.updateAccount);
router.patch("/update-password", access_control_middleware_1.verifyToken, users_controller_1.updatePassword);
router.post("/forgot-password", (req, res) => res.send("hi"));
router.get("/:id", users_controller_1.getSingleUser);
router.delete("/:id", users_controller_1.deleteUser);
exports.default = router;
