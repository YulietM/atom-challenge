"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const TaskService_1 = require("../../application/services/TaskService");
const TaskRepository_1 = require("../repositories/TaskRepository");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const taskRepository = new TaskRepository_1.TaskRepository();
const taskService = new TaskService_1.TaskService(taskRepository);
const router = (0, express_1.Router)();
exports.taskRoutes = router;
router.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
        res.status(400).json({
            success: false,
            message: "User ID is required as query parameter",
        });
        return;
    }
    const tasks = await taskService.getTasksByUserId(userId);
    res.json({
        success: true,
        data: tasks,
        message: "Tasks retrieved successfully",
    });
}));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.json({
        success: true,
        data: task,
        message: "Task retrieved successfully",
    });
}));
router.post("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const taskData = req.body;
    const task = await taskService.createTask(taskData);
    res.status(201).json({
        success: true,
        data: task,
        message: "Task created successfully",
    });
}));
router.put("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const taskData = req.body;
    const task = await taskService.updateTask(id, taskData);
    res.json({
        success: true,
        data: task,
        message: "Task updated successfully",
    });
}));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(204).json({
        success: true,
        message: "Task deleted successfully",
    });
}));
//# sourceMappingURL=taskRoutes.js.map