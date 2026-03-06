const router = require('express').Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper: get or create cart by session
async function getCart(sessionId) {
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
        cart = new Cart({ sessionId, items: [] });
        await cart.save();
    }
    return cart;
}

// GET /api/cart - Get current cart
router.get('/', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const cart = await getCart(sessionId);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/cart/add - Add item to cart
router.post('/add', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const cart = await getCart(sessionId);
        const existingItem = cart.items.find(i => i.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                icon: product.icon,
                price: product.price,
                quantity
            });
        }

        cart.calculateTotals();
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { productId, quantity } = req.body;

        const cart = await getCart(sessionId);
        const item = cart.items.find(i => i.productId.toString() === productId);

        if (!item) return res.status(404).json({ error: 'Item not in cart' });

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        cart.calculateTotals();
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/cart/remove/:productId - Remove item
router.delete('/remove/:productId', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const cart = await getCart(sessionId);
        cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
        cart.calculateTotals();
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/cart/clear - Clear cart
router.delete('/clear', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const cart = await getCart(sessionId);
        cart.items = [];
        cart.calculateTotals();
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
