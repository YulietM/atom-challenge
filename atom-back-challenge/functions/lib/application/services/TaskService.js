"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const AppErrors_1 = require("../errors/AppErrors");
class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getAllTasks() {
        return this.taskRepository.findAll();
    }
    async getTasksByUserId(userId) {
        if (!(userId === null || userId === void 0 ? void 0 : userId.trim())) {
            throw new AppErrors_1.ValidationError("User ID is required");
        }
        return this.taskRepository.findAllByUserId(userId);
    }
    async getTaskById(id) {
        if (!(id === null || id === void 0 ? void 0 : id.trim())) {
            throw new AppErrors_1.ValidationError("Task ID is required");
        }
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new AppErrors_1.NotFoundError(`Task with id ${id} not found`);
        }
        return task;
    }
    async createTask(taskData) {
        this.validateCreateTask(taskData);
        const now = new Date();
        const task = {
            title: taskData.title.trim(),
            description: taskData.description.trim(),
            done: false,
            userId: taskData.userId,
            createdAt: now,
            updatedAt: now,
        };
        return this.taskRepository.create(task);
    }
    async updateTask(id, taskData) {
        if (!(id === null || id === void 0 ? void 0 : id.trim())) {
            throw new AppErrors_1.ValidationError("Task ID is required");
        }
        this.validateUpdateTask(taskData);
        await this.getTaskById(id);
        const updatedTask = await this.taskRepository.update(id, taskData);
        if (!updatedTask) {
            throw new AppErrors_1.NotFoundError(`Task with id ${id} not found`);
        }
        return updatedTask;
    }
    async deleteTask(id) {
        if (!(id === null || id === void 0 ? void 0 : id.trim())) {
            throw new AppErrors_1.ValidationError("Task ID is required");
        }
        const deleted = await this.taskRepository.delete(id);
        if (!deleted) {
            throw new AppErrors_1.NotFoundError(`Task with id ${id} not found`);
        }
    }
    validateCreateTask(taskData) {
        var _a, _b, _c;
        if (!((_a = taskData.title) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new AppErrors_1.ValidationError("Title is required");
        }
        if (!((_b = taskData.description) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new AppErrors_1.ValidationError("Description is required");
        }
        if (!((_c = taskData.userId) === null || _c === void 0 ? void 0 : _c.trim())) {
            throw new AppErrors_1.ValidationError("User ID is required");
        }
        if (taskData.title.length > 100) {
            throw new AppErrors_1.ValidationError("Title must be less than 100 characters");
        }
        if (taskData.description.length > 500) {
            throw new AppErrors_1.ValidationError("Description must be less than 500 characters");
        }
    }
    validateUpdateTask(taskData) {
        var _a, _b;
        if (taskData.title !== undefined) {
            if (!((_a = taskData.title) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new AppErrors_1.ValidationError("Title cannot be empty");
            }
            if (taskData.title.length > 100) {
                throw new AppErrors_1.ValidationError("Title must be less than 100 characters");
            }
        }
        if (taskData.description !== undefined) {
            if (!((_b = taskData.description) === null || _b === void 0 ? void 0 : _b.trim())) {
                throw new AppErrors_1.ValidationError("Description cannot be empty");
            }
            if (taskData.description.length > 500) {
                throw new AppErrors_1.ValidationError("Description must be less than 500 characters");
            }
        }
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map