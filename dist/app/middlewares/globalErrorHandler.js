"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCoed = http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong";
    let err = error;
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        message = "Validation Error";
        err = error.message;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            message = "Dupliacte key error";
            err = error.meta;
        }
    }
    res.status(statusCoed).json({
        success: success,
        message: message,
        error: err,
    });
};
exports.default = globalErrorHandler;
