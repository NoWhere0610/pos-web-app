import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
});
const prisma = new PrismaClient({ adapter });

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const todayStats = await prisma.orders.aggregate({
      where: {
        created_at: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { total_amount: true },
      _count: { id: true },
    });

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const topProducts = await prisma.order_items.groupBy({
      by: ["product_id"],
      where: {
        orders: {
          created_at: { gte: startOfMonth },
        },
      },
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    });

    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        if (item.product_id) {
          const product = await prisma.products.findUnique({
            where: { id: item.product_id },
            select: { name: true },
          });
          return {
            name: product?.name,
            quantity: item._sum.quantity,
          };
        }
        return { name: "N/A", quantity: 0 };
      }),
    );

    const last7DaysPromises = Array.from({ length: 7 }).map(async (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));

      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));

      const dayStats = await prisma.orders.aggregate({
        where: { created_at: { gte: start, lte: end } },
        _sum: { total_amount: true },
      });

      return {
        date: `${start.getDate()}/${start.getMonth() + 1}`,
        revenue: dayStats._sum.total_amount || 0,
      };
    });

    const last7DaysData = await Promise.all(last7DaysPromises);

    res.json({
      todayRevenue: todayStats._sum.total_amount || 0,
      todayOrders: todayStats._count.id || 0,
      topProducts: topProductsWithNames,
      last7Days: last7DaysData,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy thống kê" });
  }
};
