"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helper/fileUploader");
const user_validation_1 = require("./user.validation");
const route = express_1.default.Router();
route.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserControllers.getAllUserFromDB);
route.post("/create-user", fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUser.parse(JSON.parse(req.body.data));
    return user_controller_1.UserControllers.createUserIntoDB(req, res);
});
route.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserControllers.updateUserStatusIntoDB);
route.get("/me", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserControllers.getMyProfileFromDB);
route.patch("/update-my-profile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.UserControllers.updateMyProfileIntoDB(req, res, next);
});
exports.userRoute = route;
