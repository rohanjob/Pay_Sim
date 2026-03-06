const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    icon: String,
    price: Number,
    quantity: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.methods.calculateTotals = function () {
    this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.tax = this.subtotal * 0.18;
    this.total = this.subtotal + this.tax;
};

module.exports = mongoose.model('Cart', cartSchema);
