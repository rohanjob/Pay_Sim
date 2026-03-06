const router = require('express').Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// POST /api/payments/process - Process a payment
router.post('/process', async (req, res) => {
    try {
        const { orderId, method = 'card', amount } = req.body;

        // Validate order exists
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Create payment record
        const payment = new Payment({
            orderId: order._id,
            amount: amount || order.total,
            method,
            status: 'initiated',
            transactionId: 'TXN-' + Date.now().toString(36).toUpperCase()
        });

        // Simulate gateway processing (in production, integrate with Razorpay/Stripe)
        payment.status = 'authorized';
        await payment.save();

        // Simulate capture
        payment.status = 'captured';
        payment.gatewayResponse = new Map([
            ['authCode', Math.random().toString(36).substring(2, 10).toUpperCase()],
            ['processor', 'QUANTUM_GATEWAY'],
            ['timestamp', new Date().toISOString()]
        ]);
        await payment.save();

        // Settle
        payment.status = 'settled';
        await payment.save();

        // Update order
        order.status = 'completed';
        order.paymentId = payment._id;
        await order.save();

        res.json({
            payment,
            order,
            message: 'Payment processed successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/payments/:id - Get payment status
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('orderId');
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
