import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
const { type, items, totalAmount } = req.body;
const order = await Order.create({ type, items, totalAmount, createdBy: req.user?._id });
res.status(201).json(order);
};


export const getOrders = async (req, res) => {
const orders = await Order.find().populate('items.product', 'name price').populate('createdBy', 'name email');
res.json(orders);
};