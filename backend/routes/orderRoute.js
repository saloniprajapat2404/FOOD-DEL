import express from "express";
import { placeOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/place', placeOrder);
orderRouter.post('/cancel', cancelOrder);
orderRouter.get('/user-orders', getUserOrders);
orderRouter.get('/:orderId', getOrderById);

// Admin routes
orderRouter.get('/admin/all-orders', getAllOrders);
orderRouter.put('/admin/update-status', updateOrderStatus);

export default orderRouter;
