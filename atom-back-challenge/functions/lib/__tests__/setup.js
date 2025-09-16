"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Global test setup
process.env.NODE_ENV = "test";
// Mock Firebase Admin
jest.mock("firebase-admin", () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({
        collection: jest.fn(),
    })),
}));
// Mock Firebase Functions
jest.mock("firebase-functions", () => ({
    https: {
        onRequest: jest.fn((handler) => handler),
    },
}));
//# sourceMappingURL=setup.js.map