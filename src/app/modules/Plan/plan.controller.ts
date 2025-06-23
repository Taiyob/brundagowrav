import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PlanService } from "./plan.service";
import httpStatus from "http-status";

const createPlanIntoDB = catchAsync(async (req, res) => {
  const result = await PlanService.createPlan(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Plan created successfully!!!",
    data: result,
  });
});

export const PlanController = { createPlanIntoDB };
