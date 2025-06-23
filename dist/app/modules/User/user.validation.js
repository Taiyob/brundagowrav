"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUser = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password must be set" }),
    user: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        contactNumber: zod_1.z.string({ required_error: "Phone is required" }),
    }),
});
exports.UserValidation = { createUser };
