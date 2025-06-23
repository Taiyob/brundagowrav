"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const route = express_1.default.Router();
route.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminController.getAllAdminFromDB);
route.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminController.getSingleAdminDataByIdFromDB);
route.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validation_1.AdminValidationSchema.updateValidationSchema), admin_controller_1.AdminController.updateAdminDataByIdIntoDB);
route.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminController.deleteAdminDataByIDFromDB);
route.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), admin_controller_1.AdminController.softlyDeleteAdminDataByIDFromDB);
exports.adminRoute = route;
