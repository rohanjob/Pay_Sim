# 🔐 SAI0 — DevSecOps Payment Gateway
## Complete Project Structure & Step-by-Step Build Guide (From Scratch)

---

## 📌 PROJECT OVERVIEW

| Field | Details |
|-------|---------|
| **Project Name** | DevSecOps Payment Gateway Control Temple |
| **Author** | Sai |
| **Type** | Full-Stack DevOps Project |
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript (Cyberpunk Theme) |
| **Backend** | Node.js + Express.js REST API |
| **Database** | MongoDB (Mongoose ODM) |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | Azure DevOps Pipelines |
| **Deployment Target** | Azure App Service (Containers) |
| **Theme** | Dark Cyberpunk Anti-Gravity UI |

---

## 📁 COMPLETE PROJECT STRUCTURE

```
cyberpunk-gateway/
│
├── 📄 .gitignore                        # Git ignore rules
├── 📄 README.md                         # Project documentation
├── 📄 sai0.md                           # THIS FILE — Full guide
├── 📄 docker-compose.yml                # Three-tier Docker orchestration
├── 📄 azure-pipelines.yml               # Azure DevOps CI/CD pipeline
│
├── 🎨 frontend/                         # FRONTEND (Nginx container)
│   ├── 📄 Dockerfile                    # Nginx Alpine image
│   ├── 📄 nginx.conf                    # Nginx config (proxy /api → backend)
│   ├── 📄 index.html                    # Main HTML (all modules + cart)
│   ├── 📁 css/
│   │   └── 📄 styles.css               # Complete cyberpunk CSS (2000+ lines)
│   │       ├── CSS Variables            # Color tokens, fonts, spacing
│   │       ├── CRT Overlay              # Scan-line & flicker effects
│   │       ├── Canvas Layers            # Z-index stacking for backgrounds
│   │       ├── Header & Nav             # Glassmorphism header + nav rings
│   │       ├── Module Panels            # Transaction, CI/CD, Blockchain, etc.
│   │       ├── Products & Cart          # Product grid, cart sidebar, checkout
│   │       ├── Animations               # Glitch, shockwave, camera shake, pulse
│   │       └── Responsive               # Media queries for mobile
│   └── 📁 js/
│       ├── 📄 canvas-engine.js          # Multi-layer background renderer
│       │   ├── Deep Space Layer         # Stars, pillars, fractures
│       │   ├── Fog Beams Layer          # Volumetric fog + particles
│       │   ├── Neural Grid Layer        # Animated node grid
│       │   ├── Matrix Rain Layer        # Falling code characters
│       │   └── Vault Core Layer         # Central vault, orbital nodes
│       ├── 📄 particles.js             # Interactive particle engine
│       │   ├── Ambient Particles        # Floating background particles
│       │   ├── Mouse Trails             # Cursor following particles
│       │   ├── Burst Effects            # Click/hover particle bursts
│       │   └── Ripple/Shockwave         # Expanding ring animations
│       ├── 📄 api.js                    # Backend API client (fetch wrapper)
│       │   ├── Products API             # GET /api/products
│       │   ├── Cart API                 # CRUD /api/cart
│       │   ├── Orders API               # POST/GET /api/orders
│       │   └── Payments API             # POST /api/payments/process
│       ├── 📄 cart.js                   # Shopping cart engine
│       │   ├── Add/Remove/Update        # Cart item management
│       │   ├── Sidebar Toggle           # Slide-in cart panel
│       │   ├── Totals Calculation       # Subtotal + 18% GST + Total
│       │   └── Checkout Flow            # Animated payment sequence
│       ├── 📄 ui-controller.js          # Module navigation & interactions
│       │   ├── Module Switching         # Tab-based navigation with glitch
│       │   ├── Transaction Flow         # Animated payment pipeline
│       │   ├── CI/CD Pipeline           # 6-stage pipeline animation
│       │   ├── Blockchain Ledger        # Block forging visualization
│       │   ├── Neural Network           # AI anomaly detection canvas
│       │   ├── Threat Intelligence      # World map + SIEM logs
│       │   └── Cloud Infrastructure     # Topology + biometric auth
│       └── 📄 main.js                  # App bootstrap & initialization
│           ├── Engine Init              # Canvas, Particle, UI, Cart engines
│           ├── Keyboard Shortcuts       # 1-6 modules, Space, R
│           ├── Anti-Gravity Float       # Floating panel animations
│           └── Auto-Demo Events         # Background particle events
│
├── ⚙️ backend/                          # BACKEND (Node.js container)
│   ├── 📄 Dockerfile                    # Node 20 Alpine image
│   ├── 📄 package.json                  # Dependencies & scripts
│   ├── 📄 .env.example                  # Environment variable template
│   ├── 📄 server.js                     # Express app entry point
│   │   ├── Security Middleware          # Helmet, CORS, Rate Limiting
│   │   ├── Body Parsing                 # JSON + URL-encoded
│   │   ├── Morgan Logging               # HTTP request logging
│   │   ├── Route Registration           # /api/products, cart, orders, payments
│   │   └── Error Handling               # 404 + 500 handlers
│   ├── 📁 config/
│   │   └── 📄 db.js                    # MongoDB connection (Mongoose)
│   ├── 📁 models/
│   │   ├── 📄 Product.js               # Product schema (name, price, category)
│   │   ├── 📄 Cart.js                  # Cart schema (items[], totals)
│   │   ├── 📄 Order.js                 # Order schema (items, status, payment)
│   │   └── 📄 Payment.js              # Payment schema (amount, status, txnId)
│   ├── 📁 routes/
│   │   ├── 📄 products.js             # GET /, GET /:id, POST /
│   │   ├── 📄 cart.js                  # GET /, POST /add, PUT /update, DELETE
│   │   ├── 📄 orders.js               # POST /, GET /, GET /:id
│   │   └── 📄 payments.js             # POST /process, GET /:id
│   └── 📁 middleware/
│       └── 📄 auth.js                  # JWT authentication middleware
│
└── 🗄️ database/                         # DATABASE (MongoDB container)
    └── 📄 mongo-init.js                # Seed data — 6 gateway service products
```

---

## 🛠️ STEP-BY-STEP BUILD PROCESS (From Scratch)

### PREREQUISITES

| Tool | Version | Purpose |
|------|---------|---------|
| Git | 2.40+ | Version control |
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Multi-container orchestration |
| Node.js | 20 LTS | Backend development (local dev only) |
| Azure DevOps Account | — | CI/CD pipeline |
| Azure Subscription | — | Cloud deployment |

---

### STEP 1: Create Project Directory

```bash
mkdir cyberpunk-gateway
cd cyberpunk-gateway
git init
```

---

### STEP 2: Create the Frontend

```bash
mkdir -p frontend/css frontend/js
```

#### 2.1 — Create `frontend/index.html`
- HTML5 document with Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- Persistent holographic watermark overlay
- CRT scan-line overlays
- 7 canvas layers for background effects (deep space, fog, neural grid, matrix rain, vault core, particles, foreground)
- Header with logo glyph, simulation badge, clock, threat level indicator, **cart toggle button**
- Navigation rings: Transaction Flow, CI/CD Pipeline, Blockchain Ledger, Neural Detection, Threat Intel, Cloud Infra, **Products & Cart**
- 7 module sections with glassmorphism panels
- **Products & Cart module** with 6 product cards + cart summary panel
- **Cart sidebar** (slide-in from right)
- Status bar footer
- Script includes: canvas-engine.js, particles.js, api.js, cart.js, ui-controller.js, main.js

#### 2.2 — Create `frontend/css/styles.css`
- CSS custom properties (color tokens, fonts, spacing)
- Custom cursor (`#cursor-ripple`)
- Watermark overlay with rotating diagonal text
- CRT scan-line repeating gradients + flicker animation
- Fixed canvas layers with z-index stacking (1-50)
- Glassmorphism panels (blur, rgba backgrounds, border glow)
- Tier panels, metric cards, process nodes, vault rings
- Pipeline stages with connector flow animations
- Product cards with hover glow + sweep animation
- Cart sidebar slide-in transition
- Cart item rows with quantity buttons
- 15+ keyframe animations (glitch, shockwave, camera shake, etc.)
- Responsive breakpoints (1200px, 900px)

#### 2.3 — Create `frontend/js/canvas-engine.js`
- `CanvasEngine` class managing 5 background canvas layers
- Each layer gets its own 2D context, sized to window
- **Deep Space**: stars, gradient, gothic pillars with energy veins, crimson fractures
- **Fog Beams**: volumetric angled beams + floating fog particles
- **Neural Grid**: node network with animated connections
- **Matrix Rain**: falling code characters with gravitational mouse drift
- **Vault Core**: central glow, orbital microservice nodes, DevOps rings, plasma orbs
- Mouse-based parallax for all layers

#### 2.4 — Create `frontend/js/particles.js`
- `ParticleEngine` class on 2 canvases (bg-particles, fg-interactions)
- Ambient particles with gravity toward cursor
- Mouse trail particles
- Burst effects on click/hover
- Ripple rings with expanding radius
- Crimson shockwave variant

#### 2.5 — Create `frontend/js/api.js`
- `API` singleton object using fetch()
- Auto-detects localhost vs production URL
- Endpoints: getProducts, getCart, addToCart, updateCartItem, removeFromCart, clearCart, createOrder, processPayment, health

#### 2.6 — Create `frontend/js/cart.js`
- `CartEngine` class
- Default products array (offline fallback)
- Loads from backend API if available
- add/remove/update items with quantity management
- Calculates subtotal + 18% GST tax + total
- Renders cart in main panel + sidebar
- Cart badge counter on header button
- Checkout flow: animated log sequence (JWT → Tokenization → Fraud Scan → Payment → Settlement → Blockchain)
- Particle celebration on successful checkout

#### 2.7 — Create `frontend/js/ui-controller.js`
- `UIController` class
- Module switching with glitch transition
- **Transaction Flow**: node activation, data packet visualization, JWT rings, fractal tokenization
- **CI/CD Pipeline**: 6-stage sequential animation (Build → Scan → Audit → Harden → Compliance → Deploy)
- **Blockchain Ledger**: block forging with hash generation, chain height counter
- **Neural Network**: node rendering, anomaly detection, probability arcs, heatmap
- **Threat Intel**: world map, flowing data currents, SIEM log stream, penetration test with defense shield
- **Cloud Infra**: topology constellation, network domes, Zero Trust rings, biometric hologram
- Real-time metric updates (TPS, latency, load, uptime)

#### 2.8 — Create `frontend/js/main.js`
- IIFE with DOMContentLoaded
- Initialize CanvasEngine, ParticleEngine, UIController, CartEngine
- Keyboard shortcuts (1-6 for modules, Space for actions, R for red alert)
- Anti-gravity floating animation on UI panels
- Magnetic hover attraction on interactive elements
- Auto-demo events (random particle bursts, CRT glitches)
- Window focus/blur effects

#### 2.9 — Create `frontend/Dockerfile`
```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
```

#### 2.10 — Create `frontend/nginx.conf`
- Serves static files from `/usr/share/nginx/html`
- Proxies `/api/` requests to `http://backend:5000/api/`
- WebSocket upgrade headers for real-time features

---

### STEP 3: Create the Backend

```bash
mkdir -p backend/config backend/models backend/routes backend/middleware
```

#### 3.1 — Create `backend/package.json`
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.4"
  }
}
```

#### 3.2 — Create `backend/server.js`
- Load dotenv, connect MongoDB
- Apply security middleware (Helmet, CORS, rate limiter)
- Register 4 route groups: `/api/products`, `/api/cart`, `/api/orders`, `/api/payments`
- Health check at `/api/health`
- Error handling (404 + 500)
- Listen on PORT 5000

#### 3.3 — Create `backend/config/db.js`
- Mongoose connect to `MONGODB_URI` env variable
- Default: `mongodb://mongo:27017/payment_gateway`
- Exit process on connection failure

#### 3.4 — Create `backend/.env.example`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/payment_gateway
CORS_ORIGIN=http://localhost
JWT_SECRET=your_jwt_secret_here
```

#### 3.5 — Create Database Models

| Model | File | Fields |
|-------|------|--------|
| **Product** | `models/Product.js` | name, icon, desc, price, category, features[], isActive |
| **Cart** | `models/Cart.js` | sessionId, items[{productId, name, icon, price, qty}], subtotal, tax, total |
| **Order** | `models/Order.js` | items[], subtotal, tax, total, status, paymentId, customerEmail |
| **Payment** | `models/Payment.js` | orderId, amount, currency, method, status, transactionId, gatewayResponse |

#### 3.6 — Create API Routes

| Route File | Endpoints |
|-----------|-----------|
| `routes/products.js` | `GET /` list all, `GET /:id` get one, `POST /` create |
| `routes/cart.js` | `GET /` get cart, `POST /add` add item, `PUT /update` change qty, `DELETE /remove/:id` remove, `DELETE /clear` empty cart |
| `routes/orders.js` | `POST /` create order, `GET /` list orders, `GET /:id` get order |
| `routes/payments.js` | `POST /process` process payment (initiate → authorize → capture → settle), `GET /:id` payment status |

#### 3.7 — Create `backend/middleware/auth.js`
- JWT verification middleware
- Extracts token from `Authorization: Bearer <token>` header
- Decodes and attaches `req.user`

#### 3.8 — Create `backend/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

### STEP 4: Create the Database

```bash
mkdir database
```

#### 4.1 — Create `database/mongo-init.js`
- Seed script that inserts 6 products into `payment_gateway` database:
  1. API Gateway Basic ($49/mo)
  2. WAF Protection Pro ($129/mo)
  3. Fraud Detection AI ($249/mo)
  4. Tokenization Engine ($199/mo)
  5. Blockchain Ledger ($349/mo)
  6. Enterprise Gateway ($999/mo)

---

### STEP 5: Create Docker Compose

#### 5.1 — Create `docker-compose.yml`

```yaml
services:
  frontend:    # Nginx → port 80
    build: ./frontend
    depends_on: backend

  backend:     # Node.js → port 5000
    build: ./backend
    environment: MONGODB_URI, JWT_SECRET
    depends_on: mongo

  mongo:       # MongoDB → port 27017
    image: mongo:7
    volumes: mongo-data, mongo-init.js
```

**Three-tier architecture:**
```
┌─────────────┐    ┌────────────┐    ┌────────────┐
│  FRONTEND   │───▶│  BACKEND   │───▶│  MONGODB   │
│  Nginx:80   │    │  Node:5000 │    │  Mongo:27017│
│  (static +  │    │  (REST API)│    │  (data)    │
│   proxy)    │    │            │    │            │
└─────────────┘    └────────────┘    └────────────┘
```

---

### STEP 6: Run Locally with Docker

```bash
# Build and start all 3 containers
docker-compose up --build

# Verify:
# Frontend  → http://localhost
# Backend   → http://localhost:5000/api/health
# MongoDB   → localhost:27017

# Stop:
docker-compose down

# Stop + remove volumes:
docker-compose down -v
```

---

### STEP 7: Create Azure DevOps CI/CD Pipeline

#### 7.1 — Create `azure-pipelines.yml`

**4 Pipeline Stages:**

```
┌─────────────────┐   ┌───────────────────┐   ┌────────────────┐   ┌──────────────────┐
│  STAGE 1        │──▶│  STAGE 2          │──▶│  STAGE 3       │──▶│  STAGE 4         │
│  🔨 BUILD       │   │  🛡️ SECURITY      │   │  🚧 STAGING    │   │  🚀 PRODUCTION   │
│  & TEST         │   │  SCAN             │   │  DEPLOY        │   │  DEPLOY          │
│                 │   │                   │   │                │   │                  │
│ • npm ci        │   │ • npm audit       │   │ • Azure Web    │   │ • Azure Web App  │
│ • npm test      │   │ • Snyk scan       │   │   App Deploy   │   │   Deploy         │
│ • Docker build  │   │ • OWASP ZAP       │   │ • (develop     │   │ • (main branch)  │
│ • Push to ACR   │   │ • Trivy           │   │   branch only) │   │ • Manual gate    │
└─────────────────┘   └───────────────────┘   └────────────────┘   └──────────────────┘
```

**Triggers:**
- `main` branch → Build → Security → **Production Deploy**
- `develop` branch → Build → Security → **Staging Deploy**
- Pull Requests → Build + Security only (no deploy)

---

### STEP 8: Azure Setup (One-Time)

#### 8.1 — Create Azure Resources
```bash
# Login
az login

# Create Resource Group
az group create --name payment-gateway-rg --location eastus

# Create Azure Container Registry (ACR)
az acr create --resource-group payment-gateway-rg --name paymentgatewayacr --sku Basic

# Create App Service Plans
az appservice plan create --name gateway-plan --resource-group payment-gateway-rg --is-linux --sku B1

# Create Web Apps for containers
az webapp create --resource-group payment-gateway-rg --plan gateway-plan --name gateway-frontend --deployment-container-image-name paymentgatewayacr.azurecr.io/gateway-frontend:latest

az webapp create --resource-group payment-gateway-rg --plan gateway-plan --name gateway-backend --deployment-container-image-name paymentgatewayacr.azurecr.io/gateway-backend:latest

# Create MongoDB (Azure Cosmos DB with Mongo API)
az cosmosdb create --name gateway-mongodb --resource-group payment-gateway-rg --kind MongoDB --server-version 7.0
```

#### 8.2 — Configure Azure DevOps
1. Go to **dev.azure.com** → Create new project
2. Go to **Project Settings → Service Connections**:
   - Add **Azure Resource Manager** connection → select subscription
   - Add **Docker Registry** connection → connect to ACR
3. Go to **Pipelines → Library**:
   - Add variable group with:
     - `mongodb-connection-string` (from Cosmos DB connection strings)
     - `jwt-secret` (generate a strong random string)
     - `snyk-token` (from snyk.io — optional)
4. Go to **Pipelines → Environments**:
   - Create `staging` environment
   - Create `production` environment → Add **manual approval** check
5. Go to **Pipelines → New Pipeline**:
   - Select repo → Existing YAML → `azure-pipelines.yml`
   - Run!

---

### STEP 9: Push to Git

```bash
cd cyberpunk-gateway

# Initialize repo
git init
git add .
git commit -m "feat: Initial DevSecOps Payment Gateway project

- Cyberpunk UI with 7 interactive modules + cart
- Express.js backend with products, cart, orders, payments API
- MongoDB with seed data (6 gateway products)
- Docker three-tier containerization
- Azure DevOps CI/CD pipeline (4 stages)"

# Add remote (Azure DevOps or GitHub)
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

---

### STEP 10: Verify Deployment

After the pipeline runs successfully:

```bash
# Frontend
curl https://gateway-frontend.azurewebsites.net

# Backend Health
curl https://gateway-backend.azurewebsites.net/api/health

# Products API
curl https://gateway-backend.azurewebsites.net/api/products
```

---

## 📡 API REFERENCE

### Products
```bash
# List all products
GET /api/products

# Get single product
GET /api/products/:id

# Create product
POST /api/products
Body: { "name": "...", "icon": "⚡", "desc": "...", "price": 49, "category": "gateway" }
```

### Cart
```bash
# Get current cart
GET /api/cart

# Add to cart
POST /api/cart/add
Body: { "productId": "...", "quantity": 1 }

# Update quantity
PUT /api/cart/update
Body: { "productId": "...", "quantity": 3 }

# Remove item
DELETE /api/cart/remove/:productId

# Clear cart
DELETE /api/cart/clear
```

### Orders
```bash
# Create order
POST /api/orders
Body: { "items": [...], "subtotal": 100, "tax": 18, "total": 118 }

# List orders
GET /api/orders

# Get order
GET /api/orders/:id
```

### Payments
```bash
# Process payment
POST /api/payments/process
Body: { "orderId": "...", "method": "card", "amount": 118 }

# Get payment status
GET /api/payments/:id
```

---

## 🎨 UI MODULES

| # | Module | Key | Description |
|---|--------|-----|-------------|
| 1 | Transaction Flow | `1` | 3-tier gateway visualization (Client → Processing → Settlement) |
| 2 | CI/CD Pipeline | `2` | 6-stage DevSecOps pipeline with K8s cluster hologram |
| 3 | Blockchain Ledger | `3` | Immutable audit chain with block forging animation |
| 4 | Neural Detection | `4` | AI anomaly detection neural mesh with heatmap |
| 5 | Threat Intel | `5` | Global threat map, SIEM logs, pen-test sandbox |
| 6 | Cloud Infra | `6` | Cloud topology, Zero Trust rings, biometric auth |
| 7 | Products & Cart | — | Product catalog + shopping cart + payment checkout |

**Keyboard Shortcuts:** `1-6` switch modules | `Space` trigger action | `R` red alert

---

## ⚠️ DISCLAIMER

```
╔════════════════════════════════════════════════════════════════╗
║  AUTHORIZED CYBERSECURITY TRAINING ENVIRONMENT               ║
║  DEVSECOPS PAYMENT GATEWAY SIMULATION MODE                   ║
║                                                              ║
║  This project is for EDUCATIONAL and DEVOPS TRAINING          ║
║  purposes only. No real financial transactions are processed. ║
╚════════════════════════════════════════════════════════════════╝
```

---

*Built with 💚 by Sai | DevSecOps Payment Gateway v4.2.1*
