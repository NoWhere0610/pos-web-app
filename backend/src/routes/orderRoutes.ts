import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

const router = express.Router()

router.get('/orders', getAllOrders)
router.get('/orders/:id', getOrderById)
router.post('/orders', createOrder)
router.put('/orders/:id', updateOrder)
router.delete('/orders/:id', deleteOrder)

export default router