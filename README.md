# 🔐 DevSecOps Payment Gateway

> Dark Cyberpunk Anti-Gravity Payment Gateway Control Temple  
> **Full-stack DevOps Project with Azure CI/CD Pipeline**

![Status](https://img.shields.io/badge/Status-Active-00ff88?style=for-the-badge)
![Azure DevOps](https://img.shields.io/badge/Azure%20DevOps-CI%2FCD-0078D7?style=for-the-badge&logo=azure-devops)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

---

## 📋 Project Overview

A cyberpunk-themed Payment Gateway simulation platform built as a **complete DevOps project** with:

- 🎨 **Frontend** — Cinematic cyberpunk UI with canvas animations, parallax scrolling, and glassmorphism
- ⚙️ **Backend** — Express.js REST API with product catalog, cart, orders, and payment processing
- 🗄️ **Database** — MongoDB with Mongoose ODM and seed data
- 🐳 **Docker** — Containerized three-tier architecture
- 🔄 **CI/CD** — Azure DevOps pipeline with build, security scan, staging, and production stages

---

## 🏗️ Project Structure

```
cyberpunk-gateway/
├── frontend/                    # Cyberpunk UI (Nginx)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── canvas-engine.js     # Background animations
│   │   ├── particles.js         # Particle effects  
│   │   ├── ui-controller.js     # Module controller
│   │   ├── main.js              # App bootstrap
│   │   ├── cart.js              # Shopping cart logic
│   │   └── api.js               # Backend API client
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                     # Express.js API
│   ├── server.js
│   ├── package.json
│   ├── config/db.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── payments.js
│   ├── middleware/auth.js
│   └── Dockerfile
├── database/
│   └── mongo-init.js            # Seed data (6 products)
├── docker-compose.yml           # Three-tier orchestration
├── azure-pipelines.yml          # Azure DevOps CI/CD
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Run Locally
```bash
# Clone the repo
git clone <your-repo-url>
cd cyberpunk-gateway

# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend API: http://localhost:5000/api/health
# MongoDB: localhost:27017
```

### Development (without Docker)
```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend - serve with any static file server
cd frontend
npx serve .
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product by ID |
| `GET` | `/api/cart` | Get current cart |
| `POST` | `/api/cart/add` | Add item to cart |
| `PUT` | `/api/cart/update` | Update item quantity |
| `DELETE` | `/api/cart/remove/:id` | Remove cart item |
| `DELETE` | `/api/cart/clear` | Clear entire cart |
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/payments/process` | Process payment |
| `GET` | `/api/payments/:id` | Payment status |

---

## 🔄 Azure DevOps CI/CD Pipeline

### Pipeline Stages

```
┌─────────────┐    ┌──────────────────┐    ┌────────────────┐    ┌──────────────────┐
│  🔨 BUILD   │───▶│  🛡️ SECURITY    │───▶│  🚧 STAGING    │───▶│  🚀 PRODUCTION   │
│  & TEST     │    │  SCAN            │    │  DEPLOY        │    │  DEPLOY          │
│             │    │                  │    │  (develop)     │    │  (main)          │
│ • npm ci    │    │ • npm audit      │    │                │    │                  │
│ • npm test  │    │ • Snyk scan      │    │ • Azure Web    │    │ • Azure Web      │
│ • Docker    │    │ • OWASP ZAP      │    │   App Deploy   │    │   App Deploy     │
│   build     │    │ • Trivy scan     │    │                │    │ • Manual gate    │
│ • Push ACR  │    │                  │    │                │    │                  │
└─────────────┘    └──────────────────┘    └────────────────┘    └──────────────────┘
```

### Setup Instructions

1. **Azure Resources Required:**
   - Azure Container Registry (ACR)
   - Azure App Service (2 instances: frontend + backend)
   - Azure Cosmos DB for MongoDB (or MongoDB Atlas)

2. **Azure DevOps Configuration:**
   - Create service connections for Azure and Docker Registry
   - Add pipeline variables: `mongodb-connection-string`, `jwt-secret`, `snyk-token`
   - Create environments: `staging` and `production` (with approval gates)

3. **Import Pipeline:**
   - Go to Azure DevOps → Pipelines → New Pipeline
   - Select your repo → Existing YAML file → `azure-pipelines.yml`

---

## 🛡️ Security Features

- **Helmet.js** — HTTP security headers
- **CORS** — Cross-origin resource sharing configuration
- **Rate Limiting** — 100 req/15min per IP
- **JWT Authentication** — Token-based auth middleware
- **npm audit** — Dependency vulnerability scanning
- **Snyk** — Deep vulnerability analysis
- **OWASP ZAP** — Dynamic application security testing
- **Trivy** — Container image scanning

---

## ⚠️ Disclaimer

**AUTHORIZED CYBERSECURITY TRAINING ENVIRONMENT**  
This is an educational DevSecOps simulation. No real financial transactions are processed.

---

## 📄 License

MIT License — For educational purposes only.
