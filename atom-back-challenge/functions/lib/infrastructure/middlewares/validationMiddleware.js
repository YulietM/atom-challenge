"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const AppErrors_1 = require("../../application/errors/AppErrors");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body) {
                validateObject(req.body, schema.body, "body");
            }
            if (schema.params) {
                validateObject(req.params, schema.params, "params");
            }
            if (schema.query) {
                validateObject(req.query, schema.query, "query");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
const validateObject = (obj, schema, location) => {
    for (const [key, rule] of Object.entries(schema)) {
        const value = obj[key];
        if (rule.required && (value === undefined || value === null || value === "")) {
            throw new AppErrors_1.ValidationError(`${key} is required in ${location}`);
        }
        if (value !== undefined && value !== null && value !== "") {
            validateField(key, value, rule, location);
        }
    }
};
const validateField = (key, value, rule, location) => {
    if (rule.type) {
        if (rule.type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new AppErrors_1.ValidationError(`${key} must be a valid email in ${location}`);
            }
        }
        else if (typeof value !== rule.type) {
            throw new AppErrors_1.ValidationError(`${key} must be of type ${rule.type} in ${location}`);
        }
    }
    if (rule.minLength && typeof value === "string" &&
        value.length < rule.minLength) {
        throw new AppErrors_1.ValidationError(`${key} must be at least ${rule.minLength} characters long in ${location}`);
    }
    if (rule.maxLength && typeof value === "string" &&
        value.length > rule.maxLength) {
        throw new AppErrors_1.ValidationError(`${key} must be at most ${rule.maxLength} characters long in ${location}`);
    }
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        throw new AppErrors_1.ValidationError(`${key} format is invalid in ${location}`);
    }
};
//# sourceMappingURL=validationMiddleware.js.map