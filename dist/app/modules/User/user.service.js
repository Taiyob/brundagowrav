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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helper/fileUploader");
const pagination_1 = __importDefault(require("../../../helper/pagination"));
const user_constant_1 = require("./user.constant");
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.user.email,
        password: hashedPassword,
        role: client_1.UserRole.USER,
    };
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield txClient.user.create({
            data: userData,
        });
        const createdUser = yield txClient.userProfile.create({
            data: req.body.user,
        });
        return createdUser;
    }));
    return result;
});
const getAllUser = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFileds.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    //console.dir(andConditions, { depth: Infinity });
    if (Object.keys(filterData).length > 0) {
        console.dir(Object.keys(filterData), { depth: Infinity });
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                // Debugging logs
                console.log("Filter Data:", filterData);
                console.log("Accessing key:", key, "Value:", filterData[key]);
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            userProfile: true,
        },
        // include: {
        //   admin: true,
        //   doctor: true
        // }
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateUserStatus = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: id,
        },
        data: {
            status: data.status,
        },
    });
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
        },
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.USER) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.user.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.user.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    else if (userInfo.role === client_1.UserRole.USER) {
        profileInfo = yield prisma_1.default.user.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    return Object.assign({}, profileInfo);
});
exports.UserService = {
    createUser,
    getAllUser,
    updateUserStatus,
    getMyProfile,
    updateMyProfile,
};
