"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Initialize Firebase Admin
admin.initializeApp();
const app = (0, express_1.default)();
const db = admin.firestore();
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'API is running successfully'
    });
});
// Get tasks
app.get('/tasks', async (req, res) => {
    try {
        const { userId } = req.query;
        let query = db.collection('tasks');
        if (userId) {
            query = query.where('userId', '==', userId);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const tasks = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({
            success: true,
            data: tasks,
            message: 'Tasks retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving tasks'
        });
    }
});
// Create task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        if (!title || !userId) {
            res.status(400).json({
                success: false,
                message: 'Title and userId are required'
            });
            return;
        }
        const newTask = {
            title,
            description: description || '',
            completed: false,
            userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('tasks').add(newTask);
        const doc = await docRef.get();
        res.status(201).json({
            success: true,
            data: Object.assign({ id: doc.id }, doc.data()),
            message: 'Task created successfully'
        });
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task'
        });
    }
});
// Update task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const taskRef = db.collection('tasks').doc(id);
        const doc = await taskRef.get();
        if (!doc.exists) {
            res.status(404).json({
                success: false,
                message: 'Task not found'
            });
            return;
        }
        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (completed !== undefined)
            updateData.completed = completed;
        await taskRef.update(updateData);
        const updatedDoc = await taskRef.get();
        res.json({
            success: true,
            data: Object.assign({ id: updatedDoc.id }, updatedDoc.data()),
            message: 'Task updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task'
        });
    }
});
// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const taskRef = db.collection('tasks').doc(id);
        const doc = await taskRef.get();
        if (!doc.exists) {
            res.status(404).json({
                success: false,
                message: 'Task not found'
            });
            return;
        }
        await taskRef.delete();
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task'
        });
    }
});
// Get user by email
app.get('/users/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        const userDoc = snapshot.docs[0];
        res.json({
            success: true,
            data: Object.assign({ id: userDoc.id }, userDoc.data()),
            message: 'User found successfully'
        });
    }
    catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user'
        });
    }
});
// Login or create user
app.post('/users/login-or-create', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            res.json({
                success: true,
                data: Object.assign({ id: userDoc.id }, userDoc.data()),
                message: 'User logged in successfully'
            });
            return;
        }
        const newUser = {
            email,
            name: name || 'User',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('users').add(newUser);
        const doc = await docRef.get();
        res.json({
            success: true,
            data: Object.assign({ id: doc.id }, doc.data()),
            message: 'User created and logged in successfully'
        });
    }
    catch (error) {
        console.error('Error in login-or-create:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request'
        });
    }
});
// Create user
app.post('/users', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
            res.status(409).json({
                success: false,
                message: 'User already exists'
            });
            return;
        }
        const newUser = {
            email,
            name: name || 'User',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('users').add(newUser);
        const doc = await docRef.get();
        res.status(201).json({
            success: true,
            data: Object.assign({ id: doc.id }, doc.data()),
            message: 'User created successfully'
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
});
// Export the API as a Firebase Function (2nd generation)
exports.api = (0, https_1.onRequest)({
    cors: true,
    region: 'us-central1'
}, app);
//# sourceMappingURL=index.js.map