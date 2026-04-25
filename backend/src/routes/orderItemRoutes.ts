import express from "express";
import {
createOrderItem,
deleteOrderItem,
getAllOrderItems,
getOrderItemsById,
updateOrderItems,
} from "../controllers/orderItemController";

const router = express.Router()

router.post('/order-items', createOrderItem)
router.delete('/order-items/:id', deleteOrderItem)
router.get('/order-items', getAllOrderItems)
router.get('/order-items/:id', getOrderItemsById)
router.put('/order-items/:id', updateOrderItems)

export default router