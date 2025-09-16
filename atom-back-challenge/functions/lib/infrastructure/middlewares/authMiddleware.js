"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const AppErrors_1 = require("../../application/errors/AppErrors");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppErrors_1.UnauthorizedError("Authorization token required");
        }
        const token = authHeader.substring(7);
        if (!token) {
            throw new AppErrors_1.UnauthorizedError("Authorization token required");
        }
        req.user = {
            uid: "mock-user-id",
            email: "mock@example.com",
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map