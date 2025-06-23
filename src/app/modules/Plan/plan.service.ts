import prisma from "../../../shared/prisma";

const createPlan = async (payload: any) => {
  const result = await prisma.plan.create({
    data: payload,
  });

  return result;
};

export const PlanService = { createPlan };
