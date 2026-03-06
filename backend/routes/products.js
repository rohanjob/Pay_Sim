const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/products - List all active products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ price: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/products - Create product (admin)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
