"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        access_secret: process.env.ACCESS_SECRET,
        refresh_secret: process.env.REFRESH_SECRET,
        reset_secret: process.env.RESET_SECRET,
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    emailSender: {
        email: process.env.EMAIL,
        app_password: process.env.APP_PASS,
    },
    cloudinary: {
        cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    ssl: {
        store_id: process.env.STORE_ID,
        store_passwd: process.env.STORE_PASS,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
        cancel_url: process.env.CANCEL_URL,
        ssl_payment_api: process.env.SSL_PAYMENT_API,
        ssl_validation_api: process.env.SSL_VALIDATION_API,
    },
};
