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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = 9;
    const skip = (page - 1) * limit;
    const { date } = req.query;

    let whereCondition = {};

    if (date) {
      const startDay = new Date(date as string);
      startDay.setHours(0, 0, 0, 0);
      const endDay = new Date(date as string);
      endDay.setHours(23, 59, 59, 999);
      whereCondition = {
        created_at: {
          gte: startDay,
          lte: endDay,
        },
      };
    }

    const [orders, totalCount] = await prisma.$transaction([
      prisma.orders.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
      }),
      prisma.orders.count({ where: whereCondition }),
    ]);
    res.json({
      data: orders,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { total_amount, tax_amount, paid_amount, change_amount, items } =
      req.body;

    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          total_amount,
          tax_amount,
          paid_amount,
          change_amount,
          created_at: new Date(),
        },
      });

      for (const item of items) {
        await tx.order_items.create({
          data: {
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          },
        });

        const product = await tx.products.findUnique({
          where: { id: item.product_id },
        });

        if (!product || (product.stock_quantity ?? 0) < item.quantity) {
          throw new Error(`Sản phẩm ${item.product_id} không đủ tồn kho!`);
        }

        await tx.products.update({
          where: { id: item.product_id },
          data: {
            stock_quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Lỗi xử lý đơn hàng" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { total_amount, tax_amount, paid_amount, change_amount } = req.body;

    const order = await prisma.orders.update({
      where: { id: parseInt(id) },
      data: {
        total_amount: parseInt(total_amount),
        tax_amount: parseFloat(tax_amount),
        paid_amount: parseFloat(paid_amount),
        change_amount: parseFloat(change_amount),
        created_at: new Date(),
      },
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.$transaction([
      prisma.order_items.deleteMany({
        where: { order_id: parseInt(id) },
      }),
      prisma.orders.delete({
        where: { id: parseInt(id) },
      }),
    ]);

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
