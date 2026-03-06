const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: '⚡' },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['gateway', 'security', 'ai', 'compliance', 'blockchain', 'enterprise'], required: true },
    features: [String],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
