import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes'
import dashboardRoutes from './routes/dashboardRoutes'

dotenv.config();

const app: Express = express();
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
});
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', dashboardRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
