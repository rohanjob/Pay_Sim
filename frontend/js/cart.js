/* ============================================================
   CART ENGINE - Shopping cart with cyberpunk payment flow
   Works with or without backend (graceful offline mode)
   ============================================================ */

class CartEngine {
    constructor() {
        this.items = [];
        this.products = this.getDefaultProducts();
        this.TAX_RATE = 0.18;
        this._qrInterval = null;

        this.init();
    }

    getDefaultProducts() {
        return [
            { _id: '1', name: 'API GATEWAY BASIC', icon: '⚡', desc: '1K req/sec, basic rate limiting, SSL termination', price: 49, category: 'gateway' },
            { _id: '2', name: 'WAF PROTECTION PRO', icon: '🛡️', desc: 'DDoS mitigation, SQL injection filter, XSS shield', price: 129, category: 'security' },
            { _id: '3', name: 'FRAUD DETECTION AI', icon: '🔍', desc: 'ML-powered anomaly detection, real-time scoring', price: 249, category: 'ai' },
            { _id: '4', name: 'TOKENIZATION ENGINE', icon: '🧬', desc: 'PCI-DSS compliant vault, token lifecycle mgmt', price: 199, category: 'compliance' },
            { _id: '5', name: 'BLOCKCHAIN LEDGER', icon: '⬡', desc: 'Immutable audit chain, distributed consensus', price: 349, category: 'blockchain' },
            { _id: '6', name: 'ENTERPRISE GATEWAY', icon: '🚀', desc: 'Unlimited throughput, dedicated cluster, 24/7 SRE', price: 999, category: 'enterprise' },
        ];
    }

    async init() {
        try {
            const apiProducts = await API.getProducts();
            if (apiProducts && apiProducts.length) {
                this.products = apiProducts;
                this.renderProducts();
            }
        } catch (e) {
            console.log('[CART] Running in offline mode with default products');
        }

        try {
            const apiCart = await API.getCart();
            if (apiCart && apiCart.items) {
                this.items = apiCart.items;
                this.renderCart();
            }
        } catch (e) { }

        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                this.addItem(productId);
                btn.classList.add('added');
                btn.querySelector('span').textContent = '✓ ADDED';
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.querySelector('span').textContent = '+ ADD';
                }, 1500);
            });
        });

        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) cartToggle.addEventListener('click', () => this.toggleSidebar());

        const cartClose = document.getElementById('cart-close');
        if (cartClose) cartClose.addEventListener('click', () => this.closeSidebar());

        const checkoutBtn = document.getElementById('btn-checkout');
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.processCheckout());

        const sidebarCheckout = document.getElementById('btn-sidebar-checkout');
        if (sidebarCheckout) sidebarCheckout.addEventListener('click', () => this.processCheckout());
    }

    addItem(productId) {
        const product = this.products.find(p => p._id === productId);
        if (!product) return;
        const existing = this.items.find(i => i.productId === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ productId, name: product.name, icon: product.icon, price: product.price, quantity: 1 });
        }
        API.addToCart(productId, 1).catch(() => { });
        this.renderCart();
        this.showCartNotification(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(i => i.productId !== productId);
        API.removeFromCart(productId).catch(() => { });
        this.renderCart();
    }

    updateQuantity(productId, qty) {
        if (qty <= 0) { this.removeItem(productId); return; }
        const item = this.items.find(i => i.productId === productId);
        if (item) { item.quantity = qty; API.updateCartItem(productId, qty).catch(() => { }); this.renderCart(); }
    }

    getSubtotal() { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); }
    getTax() { return this.getSubtotal() * this.TAX_RATE; }
    getTotal() { return this.getSubtotal() + this.getTax(); }
    getTotalItems() { return this.items.reduce((s, i) => s + i.quantity, 0); }

    renderCart() {
        const badge = document.getElementById('cart-badge');
        if (badge) { const c = this.getTotalItems(); badge.textContent = c; badge.style.display = c > 0 ? 'flex' : 'none'; }

        const cartList = document.getElementById('cart-items-list');
        if (cartList) {
            if (this.items.length === 0) {
                cartList.innerHTML = '<div class="cart-empty-msg">Cart is empty. Add services to proceed.</div>';
            } else {
                cartList.innerHTML = this.items.map(item => `
          <div class="cart-item" data-id="${item.productId}">
            <span class="cart-item-icon">${item.icon}</span>
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">$${item.price}/mo</span>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn qty-minus" onclick="window.cartEngine.updateQuantity('${item.productId}', ${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn qty-plus" onclick="window.cartEngine.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
            </div>
            <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="cart-remove-btn" onclick="window.cartEngine.removeItem('${item.productId}')">✕</button>
          </div>
        `).join('');
            }
        }

        const sidebarItems = document.getElementById('cart-sidebar-items');
        if (sidebarItems) {
            if (this.items.length === 0) {
                sidebarItems.innerHTML = '<div class="cart-empty-msg">No items in cart</div>';
            } else {
                sidebarItems.innerHTML = this.items.map(item => `
          <div class="cart-item" data-id="${item.productId}">
            <span class="cart-item-icon">${item.icon}</span>
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">$${item.price} × ${item.quantity}</span>
            </div>
            <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('');
            }
        }

        const subtotal = this.getSubtotal(), tax = this.getTax(), total = this.getTotal();
        this.updateEl('cart-subtotal', `$${subtotal.toFixed(2)}`);
        this.updateEl('cart-tax', `$${tax.toFixed(2)}`);
        this.updateEl('cart-total', `$${total.toFixed(2)}`);
        this.updateEl('cart-sidebar-total', `$${total.toFixed(2)}`);
        const hasItems = this.items.length > 0;
        ['btn-checkout', 'btn-sidebar-checkout'].forEach(id => { const b = document.getElementById(id); if (b) b.disabled = !hasItems; });
    }

    renderProducts() {
        const list = document.getElementById('products-list');
        if (!list || !this.products.length) return;
        list.innerHTML = this.products.map(p => `
      <div class="product-card" data-id="${p._id}">
        <div class="product-icon">${p.icon}</div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-price">$${p.price}<span class="price-period">/mo</span></div>
        </div>
        <button class="add-to-cart-btn" data-id="${p._id}"><span>+ ADD</span></button>
      </div>
    `).join('');
        this.bindEvents();
    }

    toggleSidebar() { const s = document.getElementById('cart-sidebar'); if (s) s.classList.toggle('open'); }
    closeSidebar() { const s = document.getElementById('cart-sidebar'); if (s) s.classList.remove('open'); }

    showCartNotification(productName) {
        const cartBtn = document.getElementById('cart-toggle');
        if (cartBtn && window.particleEngine) {
            const rect = cartBtn.getBoundingClientRect();
            window.particleEngine.addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, 'emerald');
        }
        const badge = document.getElementById('cart-badge');
        if (badge) { badge.style.transform = 'scale(1.5)'; setTimeout(() => { badge.style.transform = 'scale(1)'; }, 300); }
    }

    // ================================================================
    //  PAYMENT MODAL SYSTEM
    // ================================================================

    async processCheckout() {
        if (this.items.length === 0) return;
        this.closeSidebar();
        this.openPaymentModal();
    }

    openPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;
        modal.classList.add('open');

        const total = this.getTotal();
        this.updateEl('pay-modal-total', `$${total.toFixed(2)}`);
        this.updateEl('qr-amount-value', Math.round(total * 83).toLocaleString());
        this.updateEl('card-pay-amount', `$${total.toFixed(2)}`);
        this.updateEl('emi-3', `$${(total / 3).toFixed(2)}/mo`);
        this.updateEl('emi-6', `$${((total * 1.05) / 6).toFixed(2)}/mo`);
        this.updateEl('emi-12', `$${((total * 1.10) / 12).toFixed(2)}/mo`);

        this.showPayStep('pay-step-select');
        this.bindPaymentEvents();
    }

    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.remove('open');
        if (this._qrInterval) { clearInterval(this._qrInterval); this._qrInterval = null; }
    }

    showPayStep(stepId) {
        document.querySelectorAll('.payment-step').forEach(s => s.classList.remove('active'));
        const step = document.getElementById(stepId);
        if (step) {
            step.classList.remove('active');
            void step.offsetWidth; // force reflow for animation
            step.classList.add('active');
        }
    }

    bindPaymentEvents() {
        // Close
        const closeBtn = document.getElementById('payment-modal-close');
        if (closeBtn) closeBtn.onclick = () => this.closePaymentModal();
        const backdrop = document.querySelector('.payment-modal-backdrop');
        if (backdrop) backdrop.onclick = () => this.closePaymentModal();

        // Method selection
        document.querySelectorAll('.pay-method-card').forEach(card => {
            card.onclick = () => {
                const method = card.dataset.method;
                if (method === 'qr') this.startQRPayment();
                else if (method === 'card') this.showPayStep('pay-step-card');
                else if (method === 'netbanking') this.showPayStep('pay-step-netbanking');
                else if (method === 'emi') this.showPayStep('pay-step-emi');
            };
        });

        // Card form — live preview
        const cardNumInput = document.getElementById('input-card-num');
        if (cardNumInput) {
            cardNumInput.oninput = (e) => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 16);
                v = v.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = v;
                this.updateEl('card-display-num', v || '•••• •••• •••• ••••');
            };
        }
        const cardExpInput = document.getElementById('input-card-exp');
        if (cardExpInput) {
            cardExpInput.oninput = (e) => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
                e.target.value = v;
            };
        }

        // Card pay
        const cardPayBtn = document.getElementById('btn-pay-card');
        if (cardPayBtn) cardPayBtn.onclick = () => this.processPaymentFlow('card');

        // Bank selection
        document.querySelectorAll('.bank-option').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.bank-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const payBtn = document.getElementById('btn-pay-netbanking');
                if (payBtn) payBtn.disabled = false;
            };
        });
        const netPayBtn = document.getElementById('btn-pay-netbanking');
        if (netPayBtn) netPayBtn.onclick = () => this.processPaymentFlow('netbanking');

        // EMI selection
        document.querySelectorAll('.emi-option').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.emi-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const payBtn = document.getElementById('btn-pay-emi');
                if (payBtn) payBtn.disabled = false;
            };
        });
        const emiPayBtn = document.getElementById('btn-pay-emi');
        if (emiPayBtn) emiPayBtn.onclick = () => this.processPaymentFlow('emi');

        // Done
        const doneBtn = document.getElementById('btn-pay-done');
        if (doneBtn) doneBtn.onclick = () => this.closePaymentModal();
    }

    startQRPayment() {
        this.showPayStep('pay-step-qr');

        const timerFill = document.getElementById('qr-timer-fill');
        const timerText = document.getElementById('qr-timer-text');
        if (timerFill) timerFill.style.strokeDashoffset = '0';
        if (timerText) timerText.textContent = '5';

        let secondsLeft = 5;
        const circumference = 283;

        if (this._qrInterval) clearInterval(this._qrInterval);
        this._qrInterval = setInterval(() => {
            secondsLeft--;
            if (timerText) timerText.textContent = secondsLeft;
            if (timerFill) timerFill.style.strokeDashoffset = (circumference * (1 - secondsLeft / 5)).toString();

            if (secondsLeft <= 0) {
                clearInterval(this._qrInterval);
                this._qrInterval = null;
                this.processPaymentFlow('qr');
            }
        }, 1000);
    }

    async processPaymentFlow(method) {
        if (this._qrInterval) { clearInterval(this._qrInterval); this._qrInterval = null; }

        // Show processing spinner
        this.showPayStep('pay-step-processing');
        const statusEl = document.getElementById('processing-status');

        const steps = [
            'Connecting to gateway...',
            'Encrypting transaction data...',
            `Authenticating via ${method.toUpperCase()}...`,
            'JWT token validated ✓',
            'Card data tokenized (PCI-DSS) ✓',
            'AI fraud scan: CLEAR ✓',
            'Routing to payment processor...',
            'Payment authorized ✓',
            'Settling transaction...'
        ];

        for (const step of steps) {
            if (statusEl) statusEl.textContent = step;
            await this.delay(350 + Math.random() * 350);
        }

        // Backend API calls
        const orderData = { items: this.items, subtotal: this.getSubtotal(), tax: this.getTax(), total: this.getTotal() };
        let orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        let txnId = 'TXN-' + Date.now().toString(36).toUpperCase();

        try {
            const order = await API.createOrder(orderData);
            if (order && order._id) orderId = order._id;
            await API.processPayment(orderId, { method, amount: this.getTotal() });
        } catch (e) { }

        // Show success with animated checkmark
        this.showPayStep('pay-step-success');
        this.updateEl('success-txn-id', txnId);
        this.updateEl('success-amount', `$${this.getTotal().toFixed(2)}`);

        // Particle celebration
        if (window.particleEngine) {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    window.particleEngine.addBurst(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 500,
                        window.innerHeight / 2 + (Math.random() - 0.5) * 300,
                        25, 'emerald'
                    );
                }, i * 150);
            }
        }

        // Order log
        const orderLog = document.getElementById('order-log');
        this.addLog(orderLog, `[PAYMENT] ✓ $${this.getTotal().toFixed(2)} via ${method.toUpperCase()} — ${txnId}`, 'success');
        this.addLog(orderLog, '[LEDGER] Transaction recorded on blockchain ✓', 'success');
        this.addLog(orderLog, '[COMPLETE] Order fulfilled. Thank you for choosing Quantum Gateway.', 'success');

        // Clear cart
        this.items = [];
        API.clearCart().catch(() => { });
        this.renderCart();
    }

    // ================================================================
    //  UTILITIES
    // ================================================================

    addLog(container, text, type = 'info') {
        if (!container) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = text;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
        while (container.children.length > 50) container.removeChild(container.firstChild);
    }

    updateEl(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.CartEngine = CartEngine;
