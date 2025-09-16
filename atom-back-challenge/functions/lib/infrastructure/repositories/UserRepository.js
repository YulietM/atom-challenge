"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firestore_1 = require("../database/firestore");
class UserRepository {
    constructor() {
        this.collection = "users";
    }
    async findByEmail(email) {
        var _a, _b;
        const snapshot = await firestore_1.db.collection(this.collection)
            .where("email", "==", email)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        const data = doc.data();
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
    async create(user) {
        const userData = Object.assign(Object.assign({}, user), { createdAt: user.createdAt, updatedAt: user.updatedAt });
        const docRef = await firestore_1.db.collection(this.collection).add(userData);
        return Object.assign({ id: docRef.id }, userData);
    }
    async update(id, userUpdates) {
        var _a, _b;
        const docRef = firestore_1.db.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        const updates = Object.assign(Object.assign({}, userUpdates), { updatedAt: new Date() });
        await docRef.update(updates);
        const updatedDoc = await docRef.get();
        const data = updatedDoc.data();
        if (!data)
            return null;
        return Object.assign(Object.assign({ id: updatedDoc.id }, data), { createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(), updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date() });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map