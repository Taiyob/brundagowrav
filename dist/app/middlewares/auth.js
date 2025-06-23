"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonWebToken_1 = require("../../helper/jsonWebToken");
const config_1 = __importDefault(require("../../config"));
const customApiError_1 = __importDefault(require("../errors/customApiError"));
const http_status_1 = __importDefault(require("http-status"));
const auth = (...role) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new customApiError_1.default(http_status_1.default.UNAUTHORIZED, "Please login with your correct credentials!!!");
            }
            const decodedTokenInfo = (0, jsonWebToken_1.verifyToken)(token, config_1.default.jwt.access_secret);
            req.user = decodedTokenInfo; // now this decodedTokenInfo will go to controller where we use this auth
            if (role.length && !role.includes(decodedTokenInfo.role)) {
                throw new customApiError_1.default(http_status_1.default.PRECONDITION_FAILED, "You are not permitted for this work!!!");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = auth;
