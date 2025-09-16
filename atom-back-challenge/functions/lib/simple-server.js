"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const PORT = 3000;
const tasks = [];
const users = [
    {
        id: "1",
        email: "user1@test.com",
        name: "Usuario 1",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        email: "user2@test.com",
        name: "Usuario 2",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
let taskIdCounter = 1;
let userIdCounter = 3;
app.use((0, cors_1.default)({ origin: true }));
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        message: "API is running successfully",
    });
});
app.get("/api/tasks", (req, res) => {
    const { userId } = req.query;
    // Si no hay userId, devolver todas las tareas (compatibilidad)
    if (!userId) {
        res.json({
            success: true,
            data: tasks,
            message: "Tasks retrieved successfully",
        });
        return;
    }
    // Si hay userId, filtrar por usuario
    if (typeof userId !== "string") {
        res.status(400).json({
            success: false,
            message: "User ID must be a string",
        });
        return;
    }
    const userTasks = tasks.filter(task => task.userId === userId);
    res.json({
        success: true,
        data: userTasks,
        message: "Tasks retrieved successfully",
    });
});
app.get("/api/tasks/:id", (req, res) => {
    const { userId } = req.query;
    // Si no hay userId, buscar sin filtro de usuario (compatibilidad)
    if (!userId) {
        const task = tasks.find((t) => t.id === req.params.id);
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        res.json({
            success: true,
            data: task,
            message: "Task retrieved successfully",
        });
        return;
    }
    // Si hay userId, filtrar por usuario
    if (typeof userId !== "string") {
        res.status(400).json({
            success: false,
            message: "User ID must be a string",
        });
        return;
    }
    const task = tasks.find((t) => t.id === req.params.id && t.userId === userId);
    if (!task) {
        res.status(404).json({
            success: false,
            message: "Task not found",
        });
        return;
    }
    res.json({
        success: true,
        data: task,
        message: "Task retrieved successfully",
    });
});
app.post("/api/tasks", (req, res) => {
    const { title, description, userId } = req.body;
    if (!title || !description) {
        res.status(400).json({
            success: false,
            message: "Title and description are required",
        });
        return;
    }
    const newTask = {
        id: String(taskIdCounter++),
        title: title.trim(),
        description: description.trim(),
        done: false,
        userId: userId || "default", // Si no hay userId, usar "default"
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    tasks.push(newTask);
    res.status(201).json({
        success: true,
        data: newTask,
        message: "Task created successfully",
    });
});
app.put("/api/tasks/:id", (req, res) => {
    const { userId } = req.body;
    // Si no hay userId, buscar tarea sin filtro (compatibilidad)
    let taskIndex;
    if (!userId) {
        taskIndex = tasks.findIndex((t) => t.id === req.params.id);
    }
    else {
        taskIndex = tasks.findIndex((t) => t.id === req.params.id && t.userId === userId);
    }
    if (taskIndex === -1) {
        res.status(404).json({
            success: false,
            message: "Task not found",
        });
        return;
    }
    const updatedTask = Object.assign(Object.assign(Object.assign({}, tasks[taskIndex]), req.body), { updatedAt: new Date() });
    tasks[taskIndex] = updatedTask;
    res.json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully",
    });
});
app.delete("/api/tasks/:id", (req, res) => {
    const { userId } = req.body || {};
    // Si no hay userId, buscar tarea sin filtro (compatibilidad)
    let taskIndex;
    if (!userId) {
        taskIndex = tasks.findIndex((t) => t.id === req.params.id);
    }
    else {
        taskIndex = tasks.findIndex((t) => t.id === req.params.id && t.userId === userId);
    }
    if (taskIndex === -1) {
        res.status(404).json({
            success: false,
            message: "Task not found",
        });
        return;
    }
    tasks.splice(taskIndex, 1);
    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});
app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({
            success: false,
            message: "Email is required",
        });
        return;
    }
    const user = users.find((u) => u.email === email);
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }
    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            name: user.name
        },
        message: "Login successful",
    });
});
app.get("/api/users/email/:email", (req, res) => {
    const user = users.find((u) => u.email === req.params.email);
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
});
app.post("/api/users", (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        res.status(400).json({
            success: false,
            message: "Email and name are required",
        });
        return;
    }
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        res.status(409).json({
            success: false,
            message: `User with email ${email} already exists`,
        });
        return;
    }
    const newUser = {
        id: String(userIdCounter++),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.push(newUser);
    res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully",
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Simple Server running on http://localhost:${PORT}`);
    console.log("📋 API Endpoints:");
    console.log("   GET  /health - Health check");
    console.log("   POST /api/auth/login - Login with email");
    console.log("   GET  /api/tasks?userId=X - Get tasks for user");
    console.log("   POST /api/tasks - Create task (requires userId)");
    console.log("   GET  /api/tasks/:id?userId=X - Get task by ID for user");
    console.log("   PUT  /api/tasks/:id - Update task (requires userId)");
    console.log("   DELETE /api/tasks/:id - Delete task (requires userId)");
    console.log("   GET  /api/users/email/:email - Get user by email");
    console.log("   POST /api/users - Create user");
    console.log("👥 Test Users:");
    console.log("   - user1@test.com (ID: 1)");
    console.log("   - user2@test.com (ID: 2)");
    console.log("💡 Note: Using in-memory storage (data resets on restart)");
});
//# sourceMappingURL=simple-server.js.map