"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppErrors_1 = require("../../application/errors/AppErrors");
const errorHandler = (error, req, res, _next) => {
    if (error instanceof AppErrors_1.AppError) {
        res.status(error.statusCode).json(Object.assign({ success: false, message: error.message }, (process.env.NODE_ENV === "development" && { stack: error.stack })));
        return;
    }
    console.error("Unexpected error:", error);
    res.status(500).json(Object.assign({ success: false, message: "Internal server error" }, (process.env.NODE_ENV === "development" && {
        stack: error.stack,
        message: error.message,
    })));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map