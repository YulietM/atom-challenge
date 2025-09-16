"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserService_1 = require("../../application/services/UserService");
const UserRepository_1 = require("../repositories/UserRepository");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userRepository = new UserRepository_1.UserRepository();
const userService = new UserService_1.UserService(userRepository);
const router = (0, express_1.Router)();
exports.userRoutes = router;
router.get("/email/:email", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }
    res.json({
        success: true,
        data: user,
        message: "User retrieved successfully",
    });
}));
router.post("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully",
    });
}));
//# sourceMappingURL=userRoutes.js.map