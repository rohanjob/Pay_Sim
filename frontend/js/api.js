/* ============================================================
   API CLIENT - Connects frontend to backend
   ============================================================ */

const API = (() => {
    const BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : '/api';

    async function request(endpoint, options = {}) {
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(`[API] ${endpoint} failed:`, err.message);
            return null;
        }
    }

    return {
        // Products
        getProducts: () => request('/products'),
        getProduct: (id) => request(`/products/${id}`),

        // Cart
        getCart: () => request('/cart'),
        addToCart: (productId, qty = 1) => request('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity: qty })
        }),
        updateCartItem: (productId, qty) => request('/cart/update', {
            method: 'PUT',
            body: JSON.stringify({ productId, quantity: qty })
        }),
        removeFromCart: (productId) => request(`/cart/remove/${productId}`, {
            method: 'DELETE'
        }),
        clearCart: () => request('/cart/clear', { method: 'DELETE' }),

        // Orders
        createOrder: (cartData) => request('/orders', {
            method: 'POST',
            body: JSON.stringify(cartData)
        }),
        getOrders: () => request('/orders'),
        getOrder: (id) => request(`/orders/${id}`),

        // Payments
        processPayment: (orderId, paymentData) => request('/payments/process', {
            method: 'POST',
            body: JSON.stringify({ orderId, ...paymentData })
        }),
        getPaymentStatus: (id) => request(`/payments/${id}`),

        // Health
        health: () => request('/health')
    };
})();

window.API = API;
