// MongoDB Initialization Script - Seed Data
db = db.getSiblingDB('payment_gateway');

// Create Products Collection with seed data
db.products.insertMany([
    {
        name: 'API GATEWAY BASIC',
        icon: '⚡',
        desc: '1K req/sec, basic rate limiting, SSL termination',
        price: 49,
        category: 'gateway',
        features: ['1000 req/sec', 'Rate Limiting', 'SSL Termination', 'Basic Analytics'],
        isActive: true
    },
    {
        name: 'WAF PROTECTION PRO',
        icon: '🛡️',
        desc: 'DDoS mitigation, SQL injection filter, XSS shield',
        price: 129,
        category: 'security',
        features: ['DDoS Mitigation', 'SQL Injection Filter', 'XSS Shield', 'Bot Protection'],
        isActive: true
    },
    {
        name: 'FRAUD DETECTION AI',
        icon: '🔍',
        desc: 'ML-powered anomaly detection, real-time scoring',
        price: 249,
        category: 'ai',
        features: ['ML Anomaly Detection', 'Real-time Scoring', 'Behavioral Analysis', 'Risk Profiling'],
        isActive: true
    },
    {
        name: 'TOKENIZATION ENGINE',
        icon: '🧬',
        desc: 'PCI-DSS compliant vault, token lifecycle mgmt',
        price: 199,
        category: 'compliance',
        features: ['PCI-DSS Compliance', 'Token Vault', 'Lifecycle Management', 'Format-Preserving'],
        isActive: true
    },
    {
        name: 'BLOCKCHAIN LEDGER',
        icon: '⬡',
        desc: 'Immutable audit chain, distributed consensus',
        price: 349,
        category: 'blockchain',
        features: ['Immutable Audit Trail', 'Distributed Consensus', 'Smart Contracts', 'Multi-node Replication'],
        isActive: true
    },
    {
        name: 'ENTERPRISE GATEWAY',
        icon: '🚀',
        desc: 'Unlimited throughput, dedicated cluster, 24/7 SRE',
        price: 999,
        category: 'enterprise',
        features: ['Unlimited Throughput', 'Dedicated Cluster', '24/7 SRE Support', 'Custom SLAs', 'White-label'],
        isActive: true
    }
]);

print('✓ Payment Gateway database seeded with 6 products');
