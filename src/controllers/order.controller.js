import Order from "../models/order.model.js";


export const createOrder = async (req, res) => {
  try {
    const { type, items, totalAmount } = req.body;

    // Basic validation
    if (!type || !['incoming', 'outgoing'].includes(type)) {
      return res.status(400).json({ message: 'Invalid order type' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = await Order.create({
      type,
      items,
      totalAmount,
      createdBy: req.user?._id
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  }
};


export const getOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('items.product', 'name price')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments()
    ]);

    return res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};