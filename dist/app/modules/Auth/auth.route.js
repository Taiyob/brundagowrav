"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const route = express_1.default.Router();
route.post("/login", auth_controller_1.AuthController.loginUserFromDB);
route.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
route.post("/change-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), auth_controller_1.AuthController.changePassword);
route.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
route.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.AuthRoute = route;
