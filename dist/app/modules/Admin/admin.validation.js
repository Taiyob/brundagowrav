"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidationSchema = void 0;
const zod_1 = require("zod");
const updateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        //profilePhoto
        contactNumber: zod_1.z.string().optional(),
    }),
});
exports.AdminValidationSchema = { updateValidationSchema };
