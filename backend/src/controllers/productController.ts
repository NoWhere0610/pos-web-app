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

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, sku, price, stock_quantity, category } = req.body;

    const product = await prisma.products.create({
      data: {
        name,
        sku,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        category,
        created_at: new Date(),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, sku, price, stock_quantity, category } = req.body;

    const product = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        name,
        sku,
        price: parseFloat(price),
        stock_quantity: parseInt(stock_quantity),
        category,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.products.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
