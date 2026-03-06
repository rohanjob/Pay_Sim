const router = require('express').Router();
const Order = require('../models/Order');

// POST /api/orders - Create order from cart
router.post('/', async (req, res) => {
    try {
        const { items, subtotal, tax, total, customerEmail } = req.body;
        const order = new Order({ items, subtotal, tax, total, customerEmail, status: 'pending' });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/orders - List all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
