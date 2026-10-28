# 🚀 HireShield AI — Cloud PaaS Deployment Guide

This guide provides end-to-end instructions for deploying HireShield AI to modern, zero-cost / low-cost Cloud PaaS platforms:
- **Frontend**: [Next.js 15](https://nextjs.org/) on **[Vercel](https://vercel.com/)**
- **Backend API Gateway**: [Express.js](https://expressjs.com/) on **[Render](https://render.com/)** (or [Railway](https://railway.app/))
- **AI Microservice**: [Python FastAPI](https://fastapi.tiangolo.com/) on **[Render](https://render.com/)** (or [Railway](https://railway.app/))
- **Database**: **[Neon Serverless PostgreSQL](https://neon.tech/)** (Dual Connection Pooler)
- **Rate Limiting / Cache**: **[Upstash Redis](https://upstash.com/)** (Optional Serverless REST)

---

## 🗺️ Deployment Topology

```mermaid
graph LR
    User["Job Seekers & Analysts"] -->|HTTPS| Vercel["Vercel: Next.js 15 App\n(https://hireshield.vercel.app)"]
    Vercel -->|REST + JWT| RenderAPI["Render: Express API Gateway\n(https://hireshield-api.onrender.com)"]
    RenderAPI -->|Inference Cascade| RenderAI["Render: FastAPI AI Microservice\n(https://hireshield-ai.onrender.com)"]
    RenderAPI -->|Port 6543 PgBouncer| Neon["Neon Serverless PostgreSQL"]
    RenderAI -->|Google GenAI SDK| Gemini["Google Gemini 1.5 Flash\n(Google AI Studio)"]
    RenderAPI -.->|REST Token Bucket| Upstash["Upstash Redis (Optional)"]
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have free accounts on:
1. **GitHub**: Repo pushed to `https://github.com/akarsh957/hireshield-ai`
2. **Neon**: [neon.tech](https://neon.tech/) (free serverless Postgres)
3. **Google AI Studio**: [aistudio.google.com](https://aistudio.google.com/) (free Gemini API Key)
4. **Render**: [render.com](https://render.com/) (free tier web services)
5. **Vercel**: [vercel.com](https://vercel.com/) (free tier Next.js hosting)

---

## 🐘 Phase 1: Database Setup (Neon PostgreSQL)

1. **Create a Neon Project**:
   - Log in to [Neon Console](https://console.neon.tech/).
   - Click **Create Project** (Name: `hireshield-db`, Region: `US East` or nearest).
2. **Copy Connection Strings**:
   - In the Neon Dashboard, locate the connection details:
     - **Pooled connection string (`DATABASE_URL`)**:  
       Must contain `-pooler` and port `6543`.  
       *Example:*
       ```env
       DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-orange-poetry-atp7ecbu-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
       ```
     - **Direct connection string (`DIRECT_URL`)**:  
       Port `5432` without `-pooler` (used for migrations).  
       *Example:*
       ```env
       DIRECT_URL="postgresql://neondb_owner:PASSWORD@ep-orange-poetry-atp7ecbu.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
       ```
3. **Push Prisma Schema to Neon**:
   From your local development machine:
   ```powershell
   pnpm db:push
   ```
   This creates the `users`, `scan_reports`, `system_logs`, and `verified_registry` tables with all indexes.

---

## 🧠 Phase 2: Deploy Python FastAPI AI Microservice (Render)

### Option A: Using Render Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/) > **Blueprints**.
2. Click **New Blueprint Instance**.
3. Select your `hireshield-ai` repository.
4. Render will automatically read [`render.yaml`](file:///d:/hireshield-ai-v2/render.yaml) and configure both services:
   - `hireshield-ai-service`
   - `hireshield-api-gateway`
5. Fill in the required environment variables:
   - `GEMINI_API_KEY`: Your key from Google AI Studio.
   - `DATABASE_URL`: Neon pooled URL.
   - `DIRECT_URL`: Neon direct URL.
6. Click **Apply**.

---

### Option B: Manual Service Creation on Render
If configuring manually:
1. In Render, click **New +** > **Web Service**.
2. Select your `hireshield-ai` repository.
3. Configure settings:
   - **Name**: `hireshield-ai-service`
   - **Language / Runtime**: `Python`
   - **Region**: `Oregon (US West)` or `Frankfurt`
   - **Branch**: `main`
   - **Root Directory**: `apps/ai-service`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
4. **Environment Variables**:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.9` | Matches `runtime.txt` |
   | `GEMINI_API_KEY` | `AIzaSy...` | Free API key from Google AI Studio |
   | `CORS_ORIGIN` | `*` | Or specify frontend origin |
   | `AI_SERVICE_SECRET` | `generate-random-secret` | Shared secret with Express API |
5. Click **Create Web Service**.
6. **Verify Health**:
   Once deployed, open `https://hireshield-ai-service.onrender.com/health` in your browser.  
   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "hireshield-ai-service",
     "architecture": "3-Tier Hybrid Cascade",
     "tiers": {
       "tier1_deberta_nlp": "ready",
       "tier2_gemini_flash": "configured",
       "tier3_regex_fallback": "active"
     }
   }
   ```

---

## 🚪 Phase 3: Deploy Express API Gateway (Render)

1. In Render, click **New +** > **Web Service**.
2. Select your `hireshield-ai` repository.
3. Configure settings:
   - **Name**: `hireshield-api-gateway`
   - **Language / Runtime**: `Node`
   - **Region**: Same region as AI service (e.g. `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root of monorepo)
   - **Build Command**: `pnpm install && pnpm --filter @hireshield/database generate && pnpm --filter @hireshield/api build`
   - **Start Command**: `pnpm --filter @hireshield/api start`
   - **Health Check Path**: `/health`
   - **Plan**: `Free`
4. **Environment Variables**:
   | Variable | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production environment mode |
   | `PORT` | `10000` | Render assigned port |
   | `JWT_SECRET` | `32-char-random-string` | Secret for signing analyst sessions |
   | `CORS_ORIGIN` | `*` | Update to your Vercel URL once known |
   | `DATABASE_URL` | Neon pooled URL (port `6543`) | For application queries |
   | `DIRECT_URL` | Neon direct URL (port `5432`) | For Prisma migrations |
   | `AI_SERVICE_URL` | `https://hireshield-ai-service.onrender.com` | Live URL of the AI microservice |
   | `AI_SERVICE_SECRET` | Matching secret | Shared secret from Phase 2 |
   | `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | *(Optional)* Upstash Redis endpoint |
   | `UPSTASH_REDIS_REST_TOKEN` | `...` | *(Optional)* Upstash Redis token |
5. Click **Create Web Service**.
6. **Verify Health**:
   Open `https://hireshield-api-gateway.onrender.com/health`.  
   Expected response:
   ```json
   {
     "status": "online",
     "service": "hireshield-api-gateway",
     "database": "healthy",
     "demoModeAvailable": true
   }
   ```

---

## ⚡ Phase 4: Deploy Next.js 15 Web Frontend (Vercel)

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Import the `hireshield-ai` repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click `Edit` and select `apps/web` (or leave as root; both are supported via root [`vercel.json`](file:///d:/hireshield-ai-v2/vercel.json)).
   - **Build & Output Settings**:
     - *If Root Directory is `apps/web`:*
       - Build Command: `pnpm build`
       - Install Command: `pnpm install`
     - *If Root Directory is root (`./`):*
       - Automatically managed via Turborepo.
4. **Environment Variables**:
   Add the following environment variable in Vercel:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://hireshield-api-gateway.onrender.com` | Live Express API gateway URL from Phase 3 |
5. Click **Deploy**.
6. Once deployed, Vercel will assign a production domain (e.g. `https://hireshield-ai.vercel.app`).
7. **Update CORS in Render**:
   Return to Render > `hireshield-api-gateway` > **Environment**, and set:
   ```env
   CORS_ORIGIN="https://hireshield-ai.vercel.app,http://localhost:3000"
   ```

---

## 🧪 Phase 5: Production Smoke Test & Verification

Once all 3 services are deployed:

1. **Verify Web Frontend**:
   - Open your Vercel deployment URL (`https://hireshield-ai.vercel.app`).
   - The login page should render cleanly with the dot-grid canvas.
2. **Test One-Click Demo Bypass**:
   - Click **`One-Click Demo Bypass`**.
   - You should be instantly authenticated and routed to `/dashboard`.
3. **Verify Cascade Health Telemetry**:
   - In `/dashboard`, look at the top header pill: `● All Systems Operational · 410ms avg`.
   - Hover over the pill to inspect the popover displaying DeBERTa, Gemini 1.5, and Regex fallback status.
4. **Test Live Threat Scan**:
   - Navigate to `/scan`.
   - Click `Case #01: Telegram Crypto Job` and hit **Run 3-Tier Inspection**.
   - Confirm the Terminal X-Ray resolves with the Redline Risk Dossier (`93/100 Risk Score`).
5. **Test Offer Letter OCR**:
   - Select `04 Offer Letter OCR`.
   - Click `Load Scam Check Offer (.pdf)` and run inspection.
   - Confirm classification as `CONFIRMED_SCAM` with highlighted cashier check clauses.

---

## 🛠️ Troubleshooting & FAQ

### 1. Render Free Tier Spin-Down (Cold Starts)
- **Behavior**: On Render free tier, web services spin down after 15 minutes of inactivity. First request can take ~30–50s.
- **HireShield AI Resilience**: The frontend ([apps/web/lib/api.ts](file:///d:/hireshield-ai-v2/apps/web/lib/api.ts)) is engineered with automatic offline fallback. If Render services are cold-starting, the client seamlessly renders pre-computed threat telemetry and bypass sessions without crashing.
- **Tip**: You can set up a free cron heartbeat using [cron-job.org](https://cron-job.org/) to ping `/health` every 10 minutes to keep services warm.

### 2. Prisma Client Not Generated on Vercel
- If you see `Cannot find module '@prisma/client'`, ensure `@hireshield/database` has run `prisma generate`. Our root [turbo.json](file:///d:/hireshield-ai-v2/turbo.json) specifies `"dependsOn": ["^build"]` so Turborepo automatically builds `@hireshield/database` before building `apps/web`.

### 3. Gemini API Rate Limits
- Google Gemini 1.5 Flash provides 15 requests per minute (RPM) and 1,500 requests per day (RPD) on the free tier.
- If quota is exceeded, the cascade automatically degrades to **Tier 1 DeBERTa + Tier 3 Heuristics**, ensuring uninterrupted user operation.

---

*HireShield AI — Cloud Deployment Complete.*
