# Hafizi Ahmar — Full-Stack Interactive CV Portfolio & CMS Engine

[![Tech Stack](https://img.shields.io/badge/Stack-React_19_|_TypeScript_|_Tailwind_v4_|_Node_|_PostgreSQL_|_Redis-5E6C5B?style=for-the-badge)](https://github.com/hafizi-ahmar)
[![Architecture](https://img.shields.io/badge/Architecture-Approach_B_Database--Driven_CMS-C27803?style=for-the-badge)](https://github.com/hafizi-ahmar)
[![Verification](https://img.shields.io/badge/Verification-42KL_|_Project_KADA_|_Antigravity-2C2B29?style=for-the-badge)](https://github.com/hafizi-ahmar)

> **AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise**  
> *Bridging clinical operations discipline with algorithmic systems engineering, autonomous agentic workflows, and high-concurrency database architectures.*

---

## 📌 Executive Summary

This repository contains the complete, production-ready source code for **Hafizi Ahmar's Interactive CV Portfolio & Headless CMS**. Unlike static portfolios, this platform is built entirely upon **Approach B: Database-Driven CMS Architecture**. 

All portfolio records (executive profile, categorized skills matrix, career timeline, project architectures, and academic credentials) are stored in normalized **PostgreSQL** relational tables, served via a decoupled **Express REST API** (enforcing strict Routes → Controllers → Services → Repositories separation), accelerated by **Redis in-memory caching**, and dynamically rendered on a **React 19** frontend.

### 🛡️ Privacy & Anti-Scraping Safeguards
In adherence to modern privacy best practices, **raw personal contact phone numbers, personal email addresses, and residential locations are strictly excluded** from the public DOM. All recruiter inquiries and engineering opportunities are routed exclusively through a backend-validated **Interactive Contact Queue Form**, stored in PostgreSQL, and managed within a secure **Admin CMS Dashboard** protected by JWT and bcrypt password hashing.

---

## 🎨 Design System: Natural Earth & Warm Sand
The user interface implements an ergonomic, healthcare/environmental-inspired aesthetic designed for long reading sessions and zero glare:

| Element | Light Mode (Warm Sand) | Dark Mode (Mossy Charcoal) |
| :--- | :--- | :--- |
| **Canvas Background** | `#F7F4EE` (Soft Warm Sand) | `#171C18` (Deep Mossy Charcoal) |
| **Surface Cards** | `#FFFFFF` (Pure Organic White) | `#222923` (Deep Earth Slate) |
| **Primary Typography** | `#2C2B29` (Deep Earth Bark) | `#EBE7DF` (Soft Pale Mist) |
| **Primary Accent** | `#5E6C5B` (Muted Forest Moss) | `#83967F` (Soft Sage Green) |
| **Interactive Accent** | `#C27803` (Warm Amber Sun) | `#F59E0B` (Warm Amber Glow) |
| **Borders & Dividers** | `#E3DDD2` (Sand Muted Border) | `#2E382F` (Deep Slate Border) |

*Features smooth system/manual mode toggle with local storage persistence and `<meta name="color-scheme">` browser coordination.*

---

## 🏗️ System Architecture & Monorepo Structure

```
hafizi-portfolio/
├── .env.example              # Monorepo root environment variable template
├── .gitignore                # Production-grade exclusions (node_modules, .env, dist, etc.)
├── docker-compose.yml        # Docker orchestration (PostgreSQL 16 Alpine + Redis 7 Alpine)
├── package.json              # Monorepo workspaces coordinator (npm workspaces)
├── README.md                 # Complete documentation & deployment guide
│
├── backend/                  # Layered Express + TypeScript REST API
│   ├── .env.example          # Backend-specific environment variables
│   ├── package.json          # Express, pg, ioredis, zod, bcryptjs, jsonwebtoken, helmet
│   ├── tsconfig.json         # Strict TypeScript configuration
│   └── src/
│       ├── config/           # PostgreSQL pool, Redis client (with memory fallback), env validation
│       ├── controllers/      # HTTP request/response handlers (Auth, Admin, Portfolio, Message, Copilot)
│       ├── db/
│       │   ├── migrations/   # 001_init.sql: 7 relational PostgreSQL tables
│       │   ├── migrate.ts    # Automated migration runner
│       │   └── seed.ts       # Database seeder with Hafizi's authentic CV records
│       ├── middlewares/      # JWT auth guard, rate limiters, Zod validator, error handler
│       ├── repositories/     # Pure SQL query layer (profile, skills, experiences, projects, etc.)
│       ├── routes/           # Express router endpoints mounted under /api
│       ├── services/         # Business logic layer (portfolio cache sync, copilot AI engine)
│       ├── utils/            # Bcrypt hashing, JWT issuance/verification, structured logger
│       ├── app.ts            # Express application bootstrap & security middleware
│       └── server.ts         # Server startup & automatic migration/seeding verification
│
└── frontend/                 # React 19 + Vite + TypeScript + TailwindCSS v4 SPA
    ├── .env.example          # Frontend API base URL configuration
    ├── index.html            # PWA-ready HTML5 entry point with theme script
    ├── package.json          # React 19, Vite, Tailwind v4, Lucide React
    ├── tsconfig.json         # Modern bundler mode TypeScript configuration
    ├── vite.config.ts        # Vite build & local API proxy configuration
    ├── public/
    │   ├── _redirects        # Single-page app routing rule for Netlify/Cloudflare
    │   ├── favicon.svg       # Branded HA monogram favicon
    │   └── hafizi.jpg        # Professional portrait headshot
    └── src/
        ├── api/client.ts     # Canonical API client with JWT interceptor & error handling
        ├── components/       # Component-driven UI primitives:
        │   ├── Navbar.tsx            # Sticky header with theme toggle & admin shortcut
        │   ├── Hero.tsx              # Executive bio, headshot photo, verified credentials card
        │   ├── ProjectsSection.tsx   # Spotlight on URUS Platform & architecture details
        │   ├── ProjectModal.tsx      # Native HTML5 <dialog> architectural modal
        │   ├── ExperienceTimeline.tsx# Career progression from Australia healthcare to AI tech
        │   ├── SkillsMatrix.tsx      # Categorized skills with interactive category filters
        │   ├── EducationSection.tsx  # UiTM Dietetics Hons, 42KL Piscine, Project KADA Fellow
        │   ├── ContactSection.tsx    # Secure Recruiter Contact Queue Form (honeypot protected)
        │   ├── CopilotDrawer.tsx     # Interactive AI CV Copilot chat drawer
        │   ├── ThemeToggle.tsx       # Accessible Dark/Light mode switch
        │   ├── LoadingSkeleton.tsx   # High-fidelity loading skeleton UI state
        │   ├── ErrorState.tsx        # Resilient error recovery UI state with retry trigger
        │   └── Footer.tsx            # Clean branding, links, and admin portal gateway
        ├── context/          # ThemeContext & AuthContext state providers
        ├── pages/
        │   ├── PortfolioPage.tsx     # Main public-facing portfolio view
        │   └── AdminPage.tsx         # Secure Admin CMS Dashboard (/admin)
        ├── styles/index.css  # TailwindCSS v4 theme tokens & modern pseudo-classes
        ├── types/index.ts    # Shared TypeScript interfaces
        ├── App.tsx           # Route/hash controller and drawer manager
        └── main.tsx          # Application root mounting
```

---

## 🗄️ Database Schema (PostgreSQL)

The database consists of 7 relational tables defined in `backend/src/db/migrations/001_init.sql`:

1. **`profile`**: Headline, executive summary, verified external links (LinkedIn, GitHub), location, and availability badge.
2. **`skills`**: Categorized technical competencies (`Autonomous AI Development`, `Full-Stack Technologies`, `Tools & Verification`), proficiency levels (1–5), and core highlights.
3. **`experiences`**: Detailed career history, chronological intervals, locations, structured achievement bullet arrays (`TEXT[]`), and technology tag arrays.
4. **`projects`**: Project titles, taglines, comprehensive architectural descriptions, feature lists (`TEXT[]`), and repository/demo links.
5. **`education`**: Academic and specialized engineering credentials (UiTM Dietetics Hons, 42KL Piscine, Project KADA).
6. **`messages`**: Incoming recruiter contact queue with sender details, organization, message body, IP address, and status (`unread`, `read`, `replied`, `archived`).
7. **`admins`**: Authorized administrative accounts protected with bcrypt salt/hash passwords and JWT issuance.

---

## 🚀 Key Features

### 1. Flagship Highlight: URUS Platform Architecture
The portfolio highlights **URUS (Integrated SME Operations Platform)**, built during Project KADA:
- **Atomic Order Claiming:** Employs PostgreSQL row locks (`FOR UPDATE SKIP LOCKED`) within transaction boundaries to eliminate double-picking race conditions among concurrent warehouse pickers.
- **Barcode SKU Pipeline:** Camera & handheld scanner integration validating EAN-13, SKU, and QR payloads prior to releasing dispatch labels.
- **Finite State Machine:** Multi-stage lifecycle (`READY_TO_PICK` → `PICKING` → `PACKING` → `FULFILLED`) with immutable audit logs and automatic inventory deduction.
- **Redis Outbound Caching:** Sub-millisecond queue response times for high-velocity dispatch floors.

### 2. AI CV Copilot Drawer
- Recruiters can open the slide-out **AI Copilot** at any time to ask natural-language questions about Hafizi's engineering capabilities, his clinical background at NVC Group in Australia, his 42KL low-level C programming immersion, or specific system design patterns.
- Powered by a contextual knowledge engine with optional **Google Gemini API** integration.

### 3. Secure Admin CMS Dashboard (`#admin`)
- Accessible by clicking the Shield icon in the navigation bar or visiting `/#admin`.
- Authenticates against PostgreSQL with bcrypt password validation and issues stateless JWT tokens.
- **Recruiter Message Triage:** Review incoming inquiries, update statuses (`unread` → `read` → `replied` → `archived`), or delete spam.
- **Profile Live Editor:** Update headline, summary, or status badge dynamically without redeploying code.
- **Redis Cache Manager:** Inspect active cache keys and trigger instant global cache flushes.

---

## 🛠️ Quickstart: Running Locally

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Docker & Docker Compose** (for PostgreSQL and Redis)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/hafizi-ahmar/hafizi-portfolio.git
cd hafizi-portfolio

# Install monorepo root and workspace dependencies
npm install
```

### 2. Start PostgreSQL & Redis via Docker
```bash
docker compose up -d
```
*This launches PostgreSQL on port `5432` and Redis on port `6379`.*

### 3. Configure Environment Variables
Copy the root `.env.example` to `backend/.env` and `frontend/.env`:
```bash
# In backend/
cp .env.example backend/.env

# In frontend/
cp frontend/.env.example frontend/.env
```

### 4. Run Migrations & Seed Data
```bash
npm run db:seed
```
*This verifies the 7 PostgreSQL tables and seeds all authentic career, project, education, and admin records.*

### 5. Launch Development Servers
In two separate terminals:
```bash
# Terminal 1: Backend API (port 5000)
npm run dev:backend

# Terminal 2: Frontend Client (port 5173)
npm run dev:frontend
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Default Admin Credentials (Local Testing)
- **Portal URL**: `http://localhost:5173/#admin`
- **Username**: `hafizi_admin`
- **Password**: `your_secure_admin_password_here2026!`

*(Remember to change `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD` before hosting publicly).*

---

## 📡 REST API Specification

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | Healthcheck and timestamp |
| **GET** | `/api/portfolio` | Public | Returns complete portfolio records (cached in Redis for 300s) |
| **GET** | `/api/portfolio?refresh=true` | Public | Bypasses Redis and fetches directly from PostgreSQL |
| **POST** | `/api/messages` | Public (Rate Limited) | Submits recruiter contact inquiry (Zod validated, honeypot protected) |
| **POST** | `/api/copilot/chat` | Public | Recruiter queries to the AI CV Copilot |
| **POST** | `/api/auth/login` | Public | Admin login, validates bcrypt hash, returns JWT token |
| **GET** | `/api/auth/me` | JWT | Validates active admin session token |
| **PUT** | `/api/admin/profile` | JWT | Updates profile headline, bio, or status badge & evicts cache |
| **GET** | `/api/admin/messages` | JWT | Retrieves all recruiter contact inquiries |
| **PATCH**| `/api/admin/messages/:id/status`| JWT | Updates inquiry status (`read`, `replied`, `archived`) |
| **DELETE**| `/api/admin/messages/:id` | JWT | Deletes an inquiry record |
| **POST** | `/api/admin/cache/flush` | JWT | Clears all Redis cache keys |

---

## 🚀 Deployment Guide

### Option 1: Frontend on Netlify
1. Connect your GitHub repository to **Netlify**.
2. Set **Base directory**: `frontend`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `frontend/dist`
5. Under **Environment variables**, set:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api`
6. Netlify automatically detects `frontend/public/_redirects` to handle client-side routing smoothly.

### Option 2: Backend on Render or Railway
1. Create a **Web Service** pointing to the repository.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm run start`
5. Create a PostgreSQL database on **Supabase** (or Render Postgres) and set:
   - `DATABASE_URL`: `postgres://[user]:[password]@[host]:5432/[database]?sslmode=require`
   - `JWT_SECRET`: A secure random 32+ character string
   - `CORS_ORIGIN`: `https://your-portfolio.netlify.app`
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Optional) For live Gemini 1.5 Flash AI Copilot*
6. Trigger deployment. The backend will automatically run migrations and seed initial data on first boot!

---

## 📦 Git & GitHub Workflow

Initialize Git, create a clean initial commit, and push to GitHub:

```bash
# 1. Initialize Git in the project root
git init

# 2. Stage all tracked files (.gitignore excludes node_modules and .env automatically)
git add .

# 3. Create initial commit
git commit -m "feat: complete production-grade full-stack portfolio & CMS for Hafizi Ahmar"

# 4. Set default branch to main
git branch -M main

# 5. Add remote GitHub repository
git remote add origin https://github.com/hafizi-ahmar/hafizi-portfolio.git

# 6. Push to GitHub
git push -u origin main
```

---

## 👨‍💻 Author & Contact

**Hafizi Ahmar**  
*AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise*  
- **LinkedIn**: [linkedin.com/in/hafizi-ahmar/](https://www.linkedin.com/in/hafizi-ahmar/)  
- **GitHub**: [github.com/hafizi-ahmar](https://github.com/hafizi-ahmar)  
- **Portfolio & Contact Queue**: Send inquiries securely through the portfolio contact form.

---
*Built with care, precision, and natural earth ergonomics.*
