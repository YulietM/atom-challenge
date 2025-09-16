"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const firestore_1 = require("../database/firestore");
class TaskRepository {
    constructor() {
        this.collection = "tasks";
    }
    async findAll() {
        const snapshot = await firestore_1.db.collection(this.collection).get();
        return snapshot.docs.map((doc) => {
            var _a, _b;
            return (Object.assign(Object.assign({ id: doc.id }, doc.data()), { createdAt: ((_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = doc.data().updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() }));
        });
    }
    async findAllByUserId(userId) {
        const snapshot = await firestore_1.db.collection(this.collection)
            .where("userId", "==", userId)
            .get();
        return snapshot.docs.map((doc) => {
            var _a, _b;
            return (Object.assign(Object.assign({ id: doc.id }, doc.data()), { createdAt: ((_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = doc.data().updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() }));
        });
    }
    async findByIdAndUserId(id, userId) {
        var _a, _b;
        const doc = await firestore_1.db.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        if (!data || data.userId !== userId) {
            return null;
        }
        return Object.assign(Object.assign({ id: doc.id }, data), { createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() });
    }
    async findById(id) {
        var _a, _b;
        const doc = await firestore_1.db.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        if (!data)
            return null;
        return Object.assign(Object.assign({ id: doc.id }, data), { createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() });
    }
    async create(task) {
        const taskData = Object.assign(Object.assign({}, task), { createdAt: task.createdAt, updatedAt: task.updatedAt });
        const docRef = await firestore_1.db.collection(this.collection).add(taskData);
        return Object.assign({ id: docRef.id }, taskData);
    }
    async update(id, taskUpdates) {
        var _a, _b;
        const docRef = firestore_1.db.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        const updates = Object.assign(Object.assign({}, taskUpdates), { updatedAt: new Date() });
        await docRef.update(updates);
        const updatedDoc = await docRef.get();
        const data = updatedDoc.data();
        if (!data)
            return null;
        return Object.assign(Object.assign({ id: updatedDoc.id }, data), { createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() });
    }
    async delete(id) {
        const docRef = firestore_1.db.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return false;
        }
        await docRef.delete();
        return true;
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=TaskRepository.js.map