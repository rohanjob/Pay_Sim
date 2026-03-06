const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        icon: String,
        price: Number,
        quantity: Number
    }],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'], default: 'pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    customerEmail: String,
    metadata: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
