"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskService_1 = require("../../../application/services/TaskService");
const AppErrors_1 = require("../../../application/errors/AppErrors");
describe("TaskService", () => {
    let taskService;
    let mockTaskRepository;
    beforeEach(() => {
        mockTaskRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        taskService = new TaskService_1.TaskService(mockTaskRepository);
    });
    describe("getAllTasks", () => {
        it("should return all tasks", async () => {
            const mockTasks = [
                {
                    id: "1",
                    title: "Test Task",
                    description: "Test Description",
                    done: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockTaskRepository.findAll.mockResolvedValue(mockTasks);
            const result = await taskService.getAllTasks();
            expect(result).toEqual(mockTasks);
            expect(mockTaskRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });
    describe("getTaskById", () => {
        it("should return task when found", async () => {
            const mockTask = {
                id: "1",
                title: "Test Task",
                description: "Test Description",
                done: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTaskRepository.findById.mockResolvedValue(mockTask);
            const result = await taskService.getTaskById("1");
            expect(result).toEqual(mockTask);
            expect(mockTaskRepository.findById).toHaveBeenCalledWith("1");
        });
        it("should throw NotFoundError when task not found", async () => {
            mockTaskRepository.findById.mockResolvedValue(null);
            await expect(taskService.getTaskById("1")).rejects.toThrow(AppErrors_1.NotFoundError);
        });
        it("should throw ValidationError when id is empty", async () => {
            await expect(taskService.getTaskById("")).rejects.toThrow(AppErrors_1.ValidationError);
        });
    });
    describe("createTask", () => {
        it("should create task successfully", async () => {
            const createTaskData = {
                title: "New Task",
                description: "New Description",
            };
            const mockCreatedTask = {
                id: "1",
                title: "New Task",
                description: "New Description",
                done: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTaskRepository.create.mockResolvedValue(mockCreatedTask);
            const result = await taskService.createTask(createTaskData);
            expect(result).toEqual(mockCreatedTask);
            expect(mockTaskRepository.create).toHaveBeenCalledWith({
                title: "New Task",
                description: "New Description",
                done: false,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
        it("should throw ValidationError when title is empty", async () => {
            const createTaskData = {
                title: "",
                description: "New Description",
            };
            await expect(taskService.createTask(createTaskData)).rejects.toThrow(AppErrors_1.ValidationError);
        });
        it("should throw ValidationError when description is empty", async () => {
            const createTaskData = {
                title: "New Task",
                description: "",
            };
            await expect(taskService.createTask(createTaskData)).rejects.toThrow(AppErrors_1.ValidationError);
        });
    });
    describe("updateTask", () => {
        it("should update task successfully", async () => {
            const updateTaskData = {
                title: "Updated Task",
                done: true,
            };
            const mockExistingTask = {
                id: "1",
                title: "Old Task",
                description: "Old Description",
                done: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockUpdatedTask = Object.assign(Object.assign({}, mockExistingTask), { title: "Updated Task", done: true });
            mockTaskRepository.findById.mockResolvedValue(mockExistingTask);
            mockTaskRepository.update.mockResolvedValue(mockUpdatedTask);
            const result = await taskService.updateTask("1", updateTaskData);
            expect(result).toEqual(mockUpdatedTask);
            expect(mockTaskRepository.update).toHaveBeenCalledWith("1", updateTaskData);
        });
        it("should throw NotFoundError when task not found", async () => {
            mockTaskRepository.findById.mockResolvedValue(null);
            await expect(taskService.updateTask("1", { title: "Updated" })).rejects.toThrow(AppErrors_1.NotFoundError);
        });
    });
    describe("deleteTask", () => {
        it("should delete task successfully", async () => {
            mockTaskRepository.delete.mockResolvedValue(true);
            await taskService.deleteTask("1");
            expect(mockTaskRepository.delete).toHaveBeenCalledWith("1");
        });
        it("should throw NotFoundError when task not found", async () => {
            mockTaskRepository.delete.mockResolvedValue(false);
            await expect(taskService.deleteTask("1")).rejects.toThrow(AppErrors_1.NotFoundError);
        });
    });
});
//# sourceMappingURL=TaskService.test.js.map