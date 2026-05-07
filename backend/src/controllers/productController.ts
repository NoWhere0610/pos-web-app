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
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const whereCondition = search
      ? {
          OR: [{ name: { contains: search } }, { sku: { contains: search } }],
        }
      : {};

    const [products, totalCount] = await prisma.$transaction([
      prisma.products.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
      }),
      prisma.products.count({where: whereCondition}),
    ]);
    res.json({
      data: products,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.$transaction([
      prisma.order_items.deleteMany({
        where: { product_id: parseInt(id) },
      }),
      prisma.products.delete({
        where: { id: parseInt(id) },
      }),
    ]);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
