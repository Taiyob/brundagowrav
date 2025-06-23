"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const jsonWebToken_1 = require("../../../helper/jsonWebToken");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const customApiError_1 = __importDefault(require("../../errors/customApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("../../../helper/emailSender"));
const loginUser = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payLoad.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordMatch = yield bcrypt.compare(payLoad.password, existUser.password);
    if (!isPasswordMatch) {
        throw new Error("Password is incorrect, please give correct passrord!!!");
    }
    const accessToken = (0, jsonWebToken_1.createToken)(existUser.email, existUser.role, process.env.ACCESS_SECRET, 900000);
    const refreshToken = (0, jsonWebToken_1.createToken)(existUser.email, existUser.role, process.env.REFRESH_SECRET, 172800000);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        needPasswordChange: existUser.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = (0, jsonWebToken_1.verifyToken)(token, process.env.REFRESH_SECRET);
    }
    catch (error) {
        throw new Error("You are not authorized!");
    }
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = (0, jsonWebToken_1.createToken)(isUserExist.email, isUserExist.role, process.env.ACCESS_SECRET, 900000);
    return {
        accessToken: accessToken,
        needPasswordChange: isUserExist.needPasswordChange,
    };
});
const changePassword = (user, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordMatch = yield bcrypt.compare(payLoad.oldPassword, isUserExist.password);
    if (!isPasswordMatch) {
        throw new customApiError_1.default(http_status_1.default.FORBIDDEN, "Password is incorrect, please give correct passrord!!!");
    }
    const hashedPassword = yield bcrypt.hash(payLoad.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const forgotPassword = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payLoad.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isUserExist) {
        throw new customApiError_1.default(http_status_1.default.UNAUTHORIZED, "Ihis user is not exist, email is wrong, please give expected email!!!");
    }
    /*
    1 minute = 60,000 milliseconds
  
    5 minutes = 5 × 60,000 = 300,000 milliseconds
    */
    const resetPassToken = (0, jsonWebToken_1.createToken)(isUserExist.email, isUserExist.role, config_1.default.jwt.reset_secret, 300000);
    const resetPassLink = config_1.default.reset_pass_link + `?id=${isUserExist.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(isUserExist.email, `
      <div>
        <p>Dear User,</p>
        <p>
          Your Password reset link
          <a href=${resetPassLink}>
            Reset Password
          </a>
        </p>
      </div>
    `);
});
const resetPassword = (token, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payLoad.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isUserExist) {
        throw new customApiError_1.default(http_status_1.default.NOT_FOUND, "Ihis user is not exist, email is wrong, please give expected email!!!");
    }
    const isValidToken = (0, jsonWebToken_1.verifyToken)(token, config_1.default.jwt.reset_secret);
    if (!isValidToken) {
        throw new customApiError_1.default(http_status_1.default.FORBIDDEN, "Ihis user is not exist, email is wrong, please give expected email!!!");
    }
    const hashedPassword = yield bcrypt.hash(payLoad.password, 12);
    const result = yield prisma_1.default.user.update({
        where: {
            id: payLoad.id,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return result;
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
