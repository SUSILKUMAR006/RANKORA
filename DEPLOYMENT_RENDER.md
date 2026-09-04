# 🚀 RANKORA - Render Deployment Guide

This guide walks you through deploying **RANKORA** to [Render](https://render.com).

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [MongoDB Atlas Setup (Required)](#-mongodb-atlas-setup-required)
3. [Method 1: Unified Fullstack Web Service (Recommended ⭐)](#-method-1-unified-fullstack-web-service-recommended-)
4. [Method 2: 1-Click Blueprint Deployment](#-method-2-1-click-blueprint-deployment)
5. [Method 3: Separate Backend & Frontend Services](#-method-3-separate-backend--frontend-services)
6. [Environment Variables Reference](#-environment-variables-reference)
7. [Troubleshooting & Pro-Tips](#-troubleshooting--pro-tips)

---

## 🛠️ Prerequisites

1. A [GitHub](https://github.com) account with your RANKORA repository pushed.
2. A free [Render](https://render.com) account.
3. A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or another hosted MongoDB instance).

---

## 🗄️ MongoDB Atlas Setup (Required)

Before creating your Render service, ensure your MongoDB Atlas cluster allows connections from Render:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left navigation, go to **Network Access**.
3. Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) -> Click **Confirm**.
   > *Render's free tier uses dynamic outbound IPs, so `0.0.0.0/0` is necessary for connectivity.*
4. Go to **Database Access** -> Create a database user (e.g. `rankora_user`) with a strong password. Note down the password.
5. Go to **Database (Clusters)** -> Click **Connect** -> Choose **Drivers** (Node.js).
6. Copy your connection string. It will look like:
   ```env
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/rankora?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your actual credentials).*

---

## ⭐ Method 1: Unified Fullstack Web Service (Recommended)

In this approach, Render hosts a single Node.js Web Service that serves both the Express API and the React SPA static build.

- **Cost**: 1 Free Service (Fits completely in Render's Free tier).
- **CORS**: Completely avoided because frontend and backend share the same origin.

### Steps:

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> Select **Web Service**.
3. Connect your GitHub repository containing RANKORA.
4. Fill in the settings:
   - **Name**: `rankora` (or your chosen name)
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
5. Click **Advanced** -> Add the following **Environment Variables**:
   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode & static file serving |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | *(Click "Generate" or enter 32+ characters)* | JWT signing secret |
   | `JWT_EXPIRES_IN` | `30d` | JWT token lifetime |
6. Click **Create Web Service**.
7. Wait ~2-3 minutes for the build to finish. Once live, visit your Render URL (e.g. `https://rankora.onrender.com`).

---

## ⚡ Method 2: 1-Click Blueprint Deployment

RANKORA includes a pre-configured `render.yaml` file.

1. In Render Dashboard, click **New +** -> Select **Blueprint**.
2. Connect your RANKORA GitHub repository.
3. Render will read `render.yaml` and configure the service automatically.
4. In the setup prompt, enter your `MONGODB_URI`.
5. Click **Apply**.

---

## 🔀 Method 3: Separate Backend & Frontend Services

If you prefer hosting the Backend and Frontend as separate Render services:

### 1. Deploy the Backend (Web Service):
- **Name**: `rankora-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = `mongodb+srv://...`
  - `JWT_SECRET` = `<your-jwt-secret>`
  - `JWT_EXPIRES_IN` = `30d`
  - `CLIENT_URL` = `https://rankora-frontend.onrender.com` *(Update after frontend is created)*

### 2. Deploy the Frontend (Static Site):
- **Name**: `rankora-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL` = `https://rankora-backend.onrender.com/api`
- **Redirects/Rewrites** (Required for React Router client-side routing):
  - In your Static Site settings on Render, go to **Redirects/Rewrites**:
  - **Type**: `Rewrite`
  - **Source**: `/*`
  - **Destination**: `/index.html`

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env` / Render Web Service)
```ini
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/rankora?retryWrites=true&w=majority
JWT_SECRET=super_secure_random_key_here
JWT_EXPIRES_IN=30d
CLIENT_URL=https://rankora.onrender.com
```

### Frontend (`frontend/.env` / Render Static Site)
```ini
# Only needed if frontend is hosted on a separate domain from backend:
VITE_API_URL=https://rankora-backend.onrender.com/api
```

---

## 💡 Troubleshooting & Pro-Tips

### 1. Free Tier Cold Starts
Render's free web services spin down after 15 minutes of inactivity. The initial request after inactivity may take 30–50 seconds to wake up the service.
- You can test backend readiness at: `https://your-app.onrender.com/api/health`

### 2. Database Connection Timeout
- Ensure `0.0.0.0/0` is added in MongoDB Atlas **Network Access**.
- Double-check that your database user password does not have unescaped special characters (e.g., `#`, `@`, `%` should be URL-encoded if used in password).

### 3. Page Refresh Returns 404 (on Static Site deployments)
- If you deploy frontend as a Static Site, ensure you added the Rewrite rule in Render: Source `/*` -> Destination `/index.html`.
- On Unified Fullstack deployments (Method 1), this is handled automatically by the Express server!
