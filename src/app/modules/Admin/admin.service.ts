import { Prisma, UserProfile, UserRole, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import calculatePagination from "../../../helper/pagination";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllAdmin = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.UserProfileWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
    user: {
      role: {
        in: ["ADMIN", "SUPER_ADMIN"],
      },
    },
  });

  const whereConditions: Prisma.UserProfileWhereInput = { AND: andConditions };

  const result = await prisma.userProfile.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      user: true,
    },
  });

  const total = await prisma.userProfile.count({
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
};

const getSingleAdminDataById = async (
  id: string
): Promise<UserProfile | null> => {
  await prisma.userProfile.findUniqueOrThrow({
    where: {
      id: id,
      user: {
        role: UserRole.SUPER_ADMIN || UserRole.ADMIN,
      },
    },
  });

  const result = await prisma.userProfile.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateAdminDataById = async (
  id: string,
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  await prisma.userProfile.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  const result = await prisma.userProfile.update({
    where: {
      id: id,
    },
    data,
  });

  return result;
};

const deleteAdminDataByID = async (id: string): Promise<UserProfile | null> => {
  await prisma.userProfile.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const result = await prisma.$transaction(async (txClient) => {
    const deletedAdminData = await txClient.userProfile.delete({
      where: {
        id: id,
      },
    });

    await txClient.user.delete({
      where: {
        email: deletedAdminData.email,
      },
    });

    return deletedAdminData;
  });

  return result;
};

const softlyDeleteAdminDataByID = async (
  id: string
): Promise<UserProfile | null> => {
  await prisma.userProfile.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (txClient) => {
    const deletedAdminData = await txClient.userProfile.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    await txClient.user.update({
      where: {
        email: deletedAdminData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedAdminData;
  });

  return result;
};

export const AdminService = {
  getAllAdmin,
  getSingleAdminDataById,
  updateAdminDataById,
  deleteAdminDataByID,
  softlyDeleteAdminDataByID,
};

// [
//     {
//       name: {
//         contains: params.searchTerm,
//         mode: "insensitive",
//       },
//     },
//     {
//       email: {
//         contains: params.searchTerm,
//         mode: "insensitive",
//       },
//     },
//   ],
