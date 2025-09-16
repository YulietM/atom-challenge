"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../../../application/services/UserService");
const AppErrors_1 = require("../../../application/errors/AppErrors");
describe("UserService", () => {
    let userService;
    let mockUserRepository;
    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
        userService = new UserService_1.UserService(mockUserRepository);
    });
    describe("getUserByEmail", () => {
        it("should return user when found", async () => {
            const mockUser = {
                id: "1",
                email: "test@example.com",
                name: "Test User",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            const result = await userService.getUserByEmail("test@example.com");
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
        });
        it("should return null when user not found", async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            const result = await userService.getUserByEmail("test@example.com");
            expect(result).toBeNull();
        });
        it("should throw ValidationError when email is empty", async () => {
            await expect(userService.getUserByEmail("")).rejects.toThrow(AppErrors_1.ValidationError);
        });
        it("should throw ValidationError when email format is invalid", async () => {
            await expect(userService.getUserByEmail("invalid-email")).rejects.toThrow(AppErrors_1.ValidationError);
        });
    });
    describe("createUser", () => {
        it("should create user successfully", async () => {
            const createUserData = {
                email: "test@example.com",
                name: "Test User",
            };
            const mockCreatedUser = {
                id: "1",
                email: "test@example.com",
                name: "Test User",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(mockCreatedUser);
            const result = await userService.createUser(createUserData);
            expect(result).toEqual(mockCreatedUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                email: "test@example.com",
                name: "Test User",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
        it("should throw ConflictError when user already exists", async () => {
            const createUserData = {
                email: "test@example.com",
                name: "Test User",
            };
            const existingUser = {
                id: "1",
                email: "test@example.com",
                name: "Existing User",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockUserRepository.findByEmail.mockResolvedValue(existingUser);
            await expect(userService.createUser(createUserData)).rejects.toThrow(AppErrors_1.ConflictError);
        });
        it("should throw ValidationError when email is empty", async () => {
            const createUserData = {
                email: "",
                name: "Test User",
            };
            await expect(userService.createUser(createUserData)).rejects.toThrow(AppErrors_1.ValidationError);
        });
        it("should throw ValidationError when name is empty", async () => {
            const createUserData = {
                email: "test@example.com",
                name: "",
            };
            await expect(userService.createUser(createUserData)).rejects.toThrow(AppErrors_1.ValidationError);
        });
        it("should throw ValidationError when email format is invalid", async () => {
            const createUserData = {
                email: "invalid-email",
                name: "Test User",
            };
            await expect(userService.createUser(createUserData)).rejects.toThrow(AppErrors_1.ValidationError);
        });
    });
});
//# sourceMappingURL=UserService.test.js.map