import express from "express";
import { PlanController } from "./plan.controller";

const route = express.Router();

route.post("/create", PlanController.createPlanIntoDB);

export const PlanRoute = route;
