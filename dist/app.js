"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundError_1 = __importDefault(require("./app/middlewares/notFoundError"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
node_cron_1.default.schedule("* * * * *", () => {
    try {
        //AppointmentService.cancelUnpaidAppointment();
        console.log("From cron node");
    }
    catch (error) {
        console.error(error);
    }
});
app.get("/", (req, res) => {
    res.send({
        Message: "Brundagowrav server is running successfully!!!",
    });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFoundError_1.default);
exports.default = app;
