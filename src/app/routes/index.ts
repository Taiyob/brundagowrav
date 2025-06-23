import express from "express";
import { adminRoute } from "../modules/Admin/admin.route";
import { userRoute } from "../modules/User/user.route";
import { AuthRoute } from "../modules/Auth/auth.route";
import { MetaRoute } from "../modules/Meta/meta.route";
import { PlanRoute } from "../modules/Plan/plan.route";

const route = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  // {
  //   path: "/review",
  //   route: ReviewRoute,
  // },
  {
    path: "/plan",
    route: PlanRoute,
  },
  {
    path: "/meta",
    route: MetaRoute,
  },
];

moduleRoutes.forEach((router) => route.use(router.path, router.route));

export default route;
