# RANKORA — Full-Stack RPG Productivity Application

RANKORA is a cyberpunk/dark futuristic gamified productivity application with a decoupled **Frontend** (React + Vite + Tailwind + Framer Motion) and **Backend** (Node.js + Express + MongoDB/Mongoose).

---

## 📁 Project Structure

```
RANKORA/
├── frontend/                  # React + Vite Frontend Client
│   ├── src/                   # Components, Pages, Hooks, Utils, Services
│   ├── public/                # Public Assets
│   ├── index.html             # HTML Shell
│   ├── vite.config.js         # Vite Configuration
│   ├── .env                   # Frontend Environment (VITE_API_URL)
│   ├── .env.example
│   └── package.json
│
├── backend/                   # Express + MongoDB API Server
│   ├── src/
│   │   ├── config/db.js       # MongoDB Mongoose Connection
│   │   ├── controllers/       # Route Handlers
│   │   ├── middleware/        # Auth & Error Handlers
│   │   ├── models/            # Mongoose Schemas (User, Quest, Boss, Diary, etc.)
│   │   ├── routes/            # REST API Endpoints
│   │   └── server.js          # Express Application Entry Point
│   ├── .env                   # Backend Environment (MONGODB_URI, PORT, JWT)
│   ├── .env.example
│   └── package.json
│
├── README.md
└── package.json               # Root Monorepo Scripts
```

---

## ⚙️ MongoDB Setup (`backend/.env`)

Open **`backend/.env`** to configure your MongoDB connection:

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or Atlas Cloud URI)
MONGODB_URI=mongodb://127.0.0.1:27017/rankora

# JWT Authentication
JWT_SECRET=rankora_jwt_secret_key_2026_super_secure_telemetry
JWT_EXPIRES_IN=30d

# Frontend CORS
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Running the Application

### 1. Install All Dependencies:
```bash
npm run install:all
```

### 2. Start Backend Server:
```bash
npm run dev:backend
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 3. Start Frontend Client:
```bash
npm run dev:frontend
# Client runs on http://localhost:5173
```

### 4. Build Frontend for Production:
```bash
npm run build:frontend
```
