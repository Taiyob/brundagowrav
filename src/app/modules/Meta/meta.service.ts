import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;

    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;

    default:
      throw new Error("Invalid User Role");
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};
const getAdminMetaData = async () => {
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint }[] =
    await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;

  return appointmentCountByMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.user.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return formattedAppointmentStatusDistribution;
};

export const MetaService = { fetchDashboardMetaData };
