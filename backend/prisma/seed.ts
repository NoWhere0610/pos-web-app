import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.products.create({
        data: {
          name: `Sản phẩm ${i + 1}`,
          sku: `SKU-00${i + 1}`,
          price: 10000 * (i + 1),
          stock_quantity: 50,
          category: i % 2 === 0 ? 'Đồ uống' : 'Thức ăn',
          created_at: new Date(),
        },
      })
    )
  )

  for (let i = 0; i < 10; i++) {
    await prisma.orders.create({
      data: {
        total_amount: 50000,
        tax_amount: 5000,
        paid_amount: 60000,
        change_amount: 5000,
        created_at: new Date(),
        order_items: {
          create: [
            {
              product_id: products[i].id,
              quantity: 2,
              unit_price: products[i].price,
            },
          ],
        },
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())