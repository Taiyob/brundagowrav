import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const route = express.Router();

route.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllUserFromDB
);

route.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUser.parse(JSON.parse(req.body.data));
    return UserControllers.createUserIntoDB(req, res);
  }
);

route.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.updateUserStatusIntoDB
);

route.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getMyProfileFromDB
);

route.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.updateMyProfileIntoDB(req, res, next);
  }
);

export const userRoute = route;
