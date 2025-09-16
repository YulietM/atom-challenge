"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const taskRoutes_1 = require("./infrastructure/routes/taskRoutes");
const userRoutes_1 = require("./infrastructure/routes/userRoutes");
const errorHandler_1 = require("./infrastructure/middlewares/errorHandler");
const app = (0, express_1.default)();
const PORT = 3000;
// CORS configuration
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
// Middlewares
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        message: "API is running successfully",
    });
});
// API Routes
app.use("/api/tasks", taskRoutes_1.taskRoutes);
app.use("/api/users", userRoutes_1.userRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  /api/tasks - Get all tasks`);
    console.log(`   POST /api/tasks - Create task`);
    console.log(`   GET  /api/tasks/:id - Get task by ID`);
    console.log(`   PUT  /api/tasks/:id - Update task`);
    console.log(`   DELETE /api/tasks/:id - Delete task`);
    console.log(`   GET  /api/users/email/:email - Get user by email`);
    console.log(`   POST /api/users - Create user`);
});
//# sourceMappingURL=test-server.js.map