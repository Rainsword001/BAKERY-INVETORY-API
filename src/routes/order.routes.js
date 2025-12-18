import { Router } from "express";
import { createOrder, getOrders } from '../controllers/order.controller.js';
import { protect, admin } from "../middlewares/auth.middleware.js";

const orderRouter = Router();


orderRouter.post('/', protect, createOrder)
orderRouter.get('/', protect, getOrders)



export default orderRouter