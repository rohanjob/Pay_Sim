const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], default: 'card' },
    status: { type: String, enum: ['initiated', 'authorized', 'captured', 'settled', 'failed', 'refunded'], default: 'initiated' },
    gatewayResponse: { type: Map, of: String },
    transactionId: String,
    metadata: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
