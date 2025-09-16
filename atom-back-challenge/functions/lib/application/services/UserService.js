"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppErrors_1 = require("../errors/AppErrors");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserByEmail(email) {
        if (!(email === null || email === void 0 ? void 0 : email.trim())) {
            throw new AppErrors_1.ValidationError("Email is required");
        }
        this.validateEmail(email);
        return this.userRepository.findByEmail(email);
    }
    async createUser(userData) {
        this.validateCreateUser(userData);
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new AppErrors_1.ConflictError(`User with email ${userData.email} already exists`);
        }
        const now = new Date();
        const user = {
            email: userData.email.toLowerCase().trim(),
            name: userData.name.trim(),
            createdAt: now,
            updatedAt: now,
        };
        return this.userRepository.create(user);
    }
    validateCreateUser(userData) {
        var _a, _b;
        if (!((_a = userData.email) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new AppErrors_1.ValidationError("Email is required");
        }
        if (!((_b = userData.name) === null || _b === void 0 ? void 0 : _b.trim())) {
            throw new AppErrors_1.ValidationError("Name is required");
        }
        this.validateEmail(userData.email);
        if (userData.name.length > 100) {
            throw new AppErrors_1.ValidationError("Name must be less than 100 characters");
        }
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppErrors_1.ValidationError("Invalid email format");
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map