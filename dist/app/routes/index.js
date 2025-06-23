"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("../modules/Admin/admin.route");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const meta_route_1 = require("../modules/meta/meta.route");
const route = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoute,
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoute,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    // {
    //   path: "/review",
    //   route: ReviewRoute,
    // },
    {
        path: "/meta",
        route: meta_route_1.MetaRoute,
    },
];
moduleRoutes.forEach((router) => route.use(router.path, router.route));
exports.default = route;
