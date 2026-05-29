# 🛡 HireShield AI — Intelligent Job Scam & Fraud Detection Platform

AI-powered platform to detect fake jobs, phishing recruitment scams, and fraudulent companies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-HireShield%20AI-brightgreen?style=for-the-badge&logo=vercel)](https://hireshield-ai.vercel.app)
[![Node.js Version](https://img.shields.io/badge/Node.js-20+-blue?style=flat-square&logo=node.js)](https://nodejs.org)
[![Python Version](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)](https://python.org)

---

## 🌐 Live Deployment
The application is deployed live and can be accessed at:
🔗 **[https://hireshield-ai.vercel.app](https://hireshield-ai.vercel.app)**

> [!IMPORTANT]
> Because the live deployment has a fully connected backend and database, the local **Demo Mode Bypass** (`demo@hireshield.ai`) is inactive. To use the live site, please click **"Create one free"** on the Access Gateway to register a free account in the production database.

---

## 🧩 System Architecture & Request Lifecycle

HireShield AI is built as a modular multi-tier application. Below are the diagrams detailing its components and how data flows through the system.

### System Architecture
```mermaid
graph TD
    User([User / Browser]) <--> |Next.js 15 UI| Frontend[Frontend Next.js App<br/>Vercel Deployment]
    
    subgraph Local or Cloud Backend Engine
        Frontend <--> |Secure REST API / JSON| Backend[Express.js Backend API<br/>Node.js / Express / TS]
        Backend <--> |JWT Authentication| AuthM[Auth Middleware]
        Backend <--> |Store Scans & Users| DB[(PostgreSQL Database)]
        Backend <--> |Session & Rate Limits| Redis[(Redis Cache)]
    end
    
    subgraph AI Security Layer
        Backend <--> |FastAPI Routing| AIService[AI Microservice<br/>FastAPI / Python]
        AIService <--> |OCR scan of resumes/images| EasyOCR[EasyOCR Engine]
        AIService <--> |Local ML Classifiers| Transformers[HuggingFace / Scikit-Learn]
        
        Backend <--> |External Chat API| Claude[Anthropic Claude API]
    end

    classDef primary fill:#2563eb,stroke:#1d4ed8,color:#ffffff;
    classDef secondary fill:#4f46e5,stroke:#4338ca,color:#ffffff;
    classDef database fill:#059669,stroke:#047857,color:#ffffff;
    classDef external fill:#d97706,stroke:#b45309,color:#ffffff;
    
    class Frontend primary;
    class Backend secondary;
    class AIService secondary;
    class DB,Redis database;
    class Claude,EasyOCR,Transformers external;
```

### Scan & Analysis Request Lifecycle
```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant FE as Frontend (Next.js)
    participant BE as Backend (Express)
    participant AI as AI Service (FastAPI)
    
    User->>FE: Submits Job Description / Email / Image
    FE->>BE: POST /api/analysis/job (with Authorization Header)
    BE->>BE: Authenticate user & verify JWT
    alt Database is Connected
        BE->>BE: Retrieve / Log scan records in PostgreSQL
    end
    BE->>AI: Forward text to /ml/classify
    alt AI Service is Online
        AI->>AI: Run NLP Classification / EasyOCR scan
        AI-->>BE: Return classification (verdict, confidence score, flags)
    else AI Service is Offline
        BE->>BE: Run local fallback keyword-based analyzer
    end
    BE-->>FE: Return final analysis result
    FE-->>User: Display trust score, explanations, and flagged indicators
```

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js 20+** — https://nodejs.org
- **Python 3.11+** — https://python.org
- **PostgreSQL** — https://postgresql.org *(optional — app runs without it)*
- **Redis** — https://redis.io *(optional)*

---

### Step 1 — Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # already set to localhost:4000
npm run dev
# → http://localhost:3000
```

### Step 2 — Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your CLAUDE_API_KEY (from console.anthropic.com)
npm run dev
# → http://localhost:4000
# → API Docs: http://localhost:4000/api/docs
```

### Step 3 — AI Microservice (optional but recommended)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn pydantic python-multipart
# Full install (slower, enables HuggingFace models):
# pip install -r requirements.txt
python main.py
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs
```

### Step 4 — Database (optional)
```bash
# Install & start PostgreSQL, then:
createdb hireshield
# Tables are auto-created when backend starts
```

---

## 🔑 Environment Variables

### backend/.env (required)
```ini
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/hireshield
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-this-to-a-long-random-string
AI_SERVICE_URL=http://localhost:8000
CLAUDE_API_KEY=sk-ant-api03-YOUR_KEY_HERE   # Get from console.anthropic.com
FRONTEND_URL=http://localhost:3000
```

### frontend/.env.local
```ini
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🐳 Docker (run everything at once)

```bash
cp backend/.env.example backend/.env
# Add your CLAUDE_API_KEY to backend/.env
docker-compose -f docker/docker-compose.yml up
```

---

## 📱 Demo Mode & Fallbacks

HireShield AI features built-in fallbacks to work seamlessly in various environments:
* **Without a database (Demo mode):** If PostgreSQL is disconnected or fails, the backend switches to demo mode. You can log in using `demo@hireshield.ai` / `password123`.
* **Without AI microservice (Keyword analyzer):** If the FastAPI microservice is offline, the backend uses a local regex keyword analyzer (`localAnalyze`) to detect scam signals (e.g. upfront fee, earn from home) so scanning remains functional.
* **Without Claude API key:** The AI Chatbot uses the Claude API if a valid key is provided in environment variables; otherwise, it utilizes intelligent preset local responses.

> [!NOTE]
> The **"AI LLM & Database Gateway Integration"** settings panel in the frontend dashboard is a secure simulation interface designed to demonstrate key configuration management. The actual connection strings and keys are securely loaded server-side through the backend environment variables.

---

## 🗂 Project Structure

```
hireshield-ai/
├── frontend/          Next.js 15 + TypeScript + Tailwind
├── backend/           Node.js + Express + TypeScript
├── ai-service/        Python FastAPI + NLP models
├── docker/            Docker Compose configs
└── .github/           CI/CD workflows
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/analysis/job` | Analyze job description |
| POST | `/api/analysis/email` | Analyze email/message |
| POST | `/api/analysis/company` | Company trust score |
| POST | `/api/chat` | AI chatbot message |
| GET | `/api/reports` | List scam reports |
| POST | `/api/reports` | Submit report |
| GET | `/api/admin/stats` | Admin statistics |

Full interactive Swagger docs are available at **`http://localhost:4000/api/docs`** when the backend is running.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, TypeScript, JWT, PostgreSQL, Redis |
| **AI Service** | Python, FastAPI, HuggingFace Transformers, Scikit-learn, EasyOCR |
| **AI Chat** | Anthropic Claude API |
| **DevOps** | Docker, GitHub Actions, Vercel, Render |

---

Made with ❤️ by HireShield AI
