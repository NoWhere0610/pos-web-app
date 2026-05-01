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

export const getAllOrderItems = async (req: Request, res: Response) => {
  try {
    const orderItems = await prisma.order_items.findMany();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

export const getOrderItemsById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const orderItems = await prisma.order_items.findUnique({
      where: { id: parseInt(id) },
    });

    if (!orderItems) {
      res.status(404).json({ error: "Order items not found" });
      return;
    }

    res.json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { order_id, product_id, quantity, unit_price } = req.body;

    const orderItems = await prisma.order_items.create({
      data: {
        order_id,
        product_id,
        quantity,
        unit_price: parseFloat(unit_price),
      },
    });

    res.status(201).json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order item" });
  }
};

export const updateOrderItems = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { order_id, product_id, quantity, unit_price } = req.body;

    const orderItems = await prisma.order_items.update({
      where: { id: parseInt(id) },
      data: {
        order_id,
        product_id,
        quantity,
        unit_price: parseFloat(unit_price),
      },
    });

    res.json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order item" });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.order_items.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Order item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order item" });
  }
};
