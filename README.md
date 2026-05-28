# 🛡 HireShield AI — Intelligent Job Scam & Fraud Detection Platform

AI-powered platform to detect fake jobs, phishing recruitment scams, and fraudulent companies.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js 20+** — https://nodejs.org
- **Python 3.11+** — https://python.org
- **PostgreSQL** — https://postgresql.org *(optional — app runs without it)*
- **Redis** — https://redis.io *(optional)*

---

## Step 1 — Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # already set to localhost:4000
npm run dev
# → http://localhost:3000
```

## Step 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your CLAUDE_API_KEY (from console.anthropic.com)
npm run dev
# → http://localhost:4000
# → API Docs: http://localhost:4000/api/docs
```

## Step 3 — AI Microservice (optional but recommended)

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

## Step 4 — Database (optional)

```bash
# Install & start PostgreSQL, then:
createdb hireshield
# Tables are auto-created when backend starts
```

---

## 🔑 Environment Variables

### backend/.env (required)
```
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/hireshield
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-this-to-a-long-random-string
AI_SERVICE_URL=http://localhost:8000
CLAUDE_API_KEY=sk-ant-api03-YOUR_KEY_HERE   ← Get from console.anthropic.com
FRONTEND_URL=http://localhost:3000
```

### frontend/.env.local
```
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

## 📱 Demo Mode

The app works **without a database** in demo mode:
- Login with `demo@hireshield.ai` / `password123`
- AI Analyzer uses keyword-based fallback if AI service is not running
- Chat uses Claude API if key is set, otherwise uses preset responses

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
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/analysis/job | Analyze job description |
| POST | /api/analysis/email | Analyze email/message |
| POST | /api/analysis/company | Company trust score |
| POST | /api/chat | AI chatbot message |
| GET | /api/reports | List scam reports |
| POST | /api/reports | Submit report |
| GET | /api/admin/stats | Admin statistics |

Full docs at **http://localhost:4000/api/docs**

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js, TypeScript, JWT, PostgreSQL, Redis |
| AI Service | Python, FastAPI, HuggingFace Transformers, Scikit-learn, EasyOCR |
| AI Chat | Anthropic Claude API |
| DevOps | Docker, GitHub Actions, Vercel, Render |

---

Made with ❤️ by HireShield AI
