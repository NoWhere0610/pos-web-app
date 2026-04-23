import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import productRoutes from './routes/productRoutes';

dotenv.config();

const app: Express = express();
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "123456",
  database: process.env.DATABASE_NAME || "interntestpos",
  port: 3306,
});
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

// app.get("/api/products", async (req, res) => {
//   try {
//     const allProducts = await prisma.products.findMany();
//     res.json(allProducts);
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.get("/api/orders", async (req, res) => {
//   try {
//     const allOrders = await prisma.orders.findMany();
//     res.json(allOrders);
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.get("/api/order-items", async (req, res) => {
//   try {
//     const allOrderItems = await prisma.order_items.findMany();
//     res.json(allOrderItems);
//   } catch (error) {
//     console.error(error);
//   }
// });

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
