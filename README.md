# Hafizi Ahmar — Full-Stack Portfolio & Headless CMS Engine

[![Architecture](https://img.shields.io/badge/Architecture-Decoupled_Full--Stack_CMS-5E6C5B?style=for-the-badge)](https://github.com/hafiziahmar/portfolio)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_16_|_Redis_7-C27803?style=for-the-badge)](https://github.com/hafiziahmar/portfolio)
[![Frontend](https://img.shields.io/badge/Frontend-React_19_|_TailwindCSS_v4-2C2B29?style=for-the-badge)](https://github.com/hafiziahmar/portfolio)
[![Security](https://img.shields.io/badge/Security-JWT_|_Bcrypt_|_Zod_|_Anti--Scraping-3B5249?style=for-the-badge)](https://github.com/hafiziahmar/portfolio)

> **AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Healthcare Foundation (Dietetics Hons.)**  
> *Translating operational rigor and algorithmic thinking into production-grade, database-driven web systems.*

---

## 🏛️ Executive Architectural Overview

This system is engineered as an enterprise-grade, database-backed portfolio and content management engine designed to showcase full-stack software architecture, data integrity, and defensive engineering.

Rather than relying on static site generation, this platform operates on a **decoupled, event-driven multi-tier architecture**:

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier"]
        UI["React 19 SPA (TailwindCSS v4)"]
        Copilot["Toph AI CV Copilot (Interactive Drawer)"]
        CMS["Secure Admin CMS Portal (JWT Authenticated)"]
    end

    subgraph Gateway ["API & Gateway Tier"]
        API["Node.js / Express REST API (Strict TypeScript)"]
        Security["Defensive Layer: Helmet, CORS, Rate Limiters, Zod"]
        Router["Layered Routing (Routes → Controllers → Services → Repositories)"]
    end

    subgraph Data ["Data & Caching Tier"]
        Cache[("Redis 7 In-Memory Cache (Sub-ms Latency)")]
        DB[("PostgreSQL 16 Relational Engine (Normalized Schema)")]
    end

    subgraph AI ["AI & Intelligence Engine"]
        LLM["Google Gemini API (Deterministic Knowledge Engine Fallback)"]
    end

    UI --> Security
    CMS --> Security
    Security --> API
    API --> Router
    Router --> Cache
    Router --> DB
    Copilot --> API
    API --> LLM
```

---

## ⚙️ Core Engineering Design Decisions

### 1. Relational PostgreSQL Schema & Strict Data Integrity
All portfolio data — professional experiences, technical skill inventories, capstone projects, education credentials, and incoming recruiter messages — are modeled into normalized PostgreSQL tables:
- **Foreign Constraints & Parameterized Queries**: Strict SQL parameterization (`$1, $2, ...`) eliminates SQL injection vectors.
- **Concurrency Control**: Employs PostgreSQL row-level locks (`FOR UPDATE SKIP LOCKED`) in multi-user workflows to prevent data race conditions.
- **Automated Versioned Migrations**: SQL DDL schemas run idempotently upon application initialization.

### 2. High-Throughput Redis Caching with Write-Through Invalidation
To minimize database read amplification while ensuring instantaneous global updates:
- Public portfolio reads (`GET /api/portfolio`) are cached in Redis with a 300-second TTL.
- Any write operation in the Admin CMS (e.g. updating a project, adding a new skill category, or modifying bio details) immediately triggers **atomic cache eviction** (`redis.del('portfolio:full')`).
- If Redis is unreachable, the backend automatically fails over to an in-memory cache without dropping client traffic.

### 3. Layered Enterprise Architecture
The backend strictly adheres to the 4-layer architectural separation:
1. **Routes**: Declarative HTTP endpoint definitions and authentication guards.
2. **Controllers**: Request extraction, HTTP status coordination, and response serialization.
3. **Services**: Business logic, cache synchronization, and AI copilot query dispatching.
4. **Repositories**: Pure SQL abstraction and data access operations.

### 4. Defensive Security & Zero-Trust Authentication
- **Stateless Authentication**: Admin endpoints require cryptographically signed JSON Web Tokens (JWT) verified via middleware.
- **Bcrypt Password Hashing**: Passwords stored using 10 salt rounds with constant-time verification.
- **Zod Runtime Contracts**: All incoming HTTP payloads undergo strict type-checking and sanitization before hitting business services.
- **Anti-Bot & Rate Limiting**: Dedicated rate-limiting tiers (`copilotLimiter`, `contactLimiter`) throttle automated scraping and denial-of-service attempts.

---

## 🛡️ Privacy & Contact Protection Architecture

In adherence to strict personal privacy best practices:
- **Zero Raw PII Exposure**: Private phone numbers, residential addresses, and personal email addresses are intentionally excluded from the public DOM.
- **Authenticated Message Queue**: Recruiter and engineering inquiries route through a secure, backend-validated **Contact Queue**. Inquiries are stored directly in PostgreSQL with honeypot spam protection and triaged exclusively within the authenticated Admin CMS.
- **AI Privacy Guardrails**: The integrated AI Copilot (**Toph**) enforces strict system boundary constraints, deflecting queries targeting private personal details while facilitating verified recruiter communication.

---

## 🤖 AI CV Copilot Engine: "Toph"

The portfolio features **Toph**, an integrated conversational copilot engineered to answer recruiter queries regarding architectural decisions, technical stack proficiencies, and career progression:
- **Grounded Verification**: Answers strictly reflect verified CV records, 42KL systems programming training, Project KADA engineering methodologies, and NVC Group clinical operations.
- **Dual-Mode Engine**: Dynamically interfaces with the **Google Gemini API** when credentials are provided, seamlessly falling back to a deterministic, zero-latency local knowledge engine if external APIs are unavailable.
- **Context Boundaries**: Operates under strict non-authoritative boundaries to ensure accurate technical representation without hallucination.

---

## 🎨 Natural Earth & Warm Sand Design System

The frontend user experience is built upon an organic, nature-inspired palette tailored for readability, focus, and zero eye fatigue:

| Element | Light Mode (Warm Sand) | Dark Mode (Mossy Charcoal) |
| :--- | :--- | :--- |
| **Canvas Background** | `#F7F4EE` (Soft Warm Sand) | `#171C18` (Deep Mossy Charcoal) |
| **Surface Cards** | `#FFFFFF` (Organic White) | `#222923` (Deep Earth Slate) |
| **Primary Typography** | `#2C2B29` (Deep Earth Bark) | `#EBE7DF` (Soft Pale Mist) |
| **Primary Accent** | `#5E6C5B` (Muted Forest Moss) | `#83967F` (Soft Sage Green) |
| **Interactive Accent**| `#C27803` (Warm Amber Sun) | `#F59E0B` (Warm Amber Glow) |
| **Borders & Dividers**| `#E3DDD2` (Sand Muted Border) | `#2E382F` (Deep Slate Border) |

- **TailwindCSS v4**: Modern CSS-first configuration using CSS variables and semantic theme classes.
- **Typography**: Fully justified, relaxed readability layout with semantic HTML5 structuring.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System health check and uptime timestamp |
| `GET` | `/api/portfolio` | Public | Full portfolio payload (Redis-cached, sub-5ms response) |
| `POST` | `/api/messages` | Public (Rate Limited) | Submit recruiter contact inquiry (Zod validated, honeypot protected) |
| `POST` | `/api/copilot/chat` | Public (Rate Limited) | Query Toph AI CV Copilot |
| `POST` | `/api/auth/login` | Public | Authenticate administrator via bcrypt & issue JWT |
| `GET` | `/api/auth/me` | Admin (JWT) | Validate active admin session |
| `PUT` | `/api/admin/profile` | Admin (JWT) | Update headline, summary, or availability status |
| `POST` | `/api/admin/projects` | Admin (JWT) | Add a new project to the portfolio |
| `PUT` | `/api/admin/projects/:id` | Admin (JWT) | Update project name, dates, or technical description |
| `DELETE` | `/api/admin/projects/:id` | Admin (JWT) | Delete a project record |
| `POST` | `/api/admin/education` | Admin (JWT) | Add an education or training credential |
| `PUT` | `/api/admin/education/:id` | Admin (JWT) | Update education title, provider, dates, or description |
| `DELETE` | `/api/admin/education/:id` | Admin (JWT) | Delete an education credential |
| `POST` | `/api/admin/skills` | Admin (JWT) | Add a new skill (with custom dynamic category support) |
| `DELETE` | `/api/admin/skills/:id` | Admin (JWT) | Delete a skill record |
| `GET` | `/api/admin/messages` | Admin (JWT) | Retrieve incoming recruiter inquiries |
| `PATCH`| `/api/admin/messages/:id/status` | Admin (JWT) | Update inquiry status (`unread` → `read` → `replied` → `archived`) |
| `POST` | `/api/admin/cache/flush` | Admin (JWT) | Invalidate and flush all Redis cache keys |

---

## 💻 Local Engineering Environment

### Infrastructure Requirements
- **Runtime**: Node.js v20+ / npm v10+
- **Containers**: Docker Desktop (PostgreSQL 16 Alpine + Redis 7 Alpine)

### Container Orchestration
```bash
# Launch PostgreSQL and Redis instances in isolated containers
docker compose up -d

# Verify container health
docker ps
```

### Environment Configuration
Sensitive values and secrets are managed exclusively through untracked environment files:
- Backend: `backend/.env` (configured from `backend/.env.example`)
- Frontend: `frontend/.env` (configured from `frontend/.env.example`)

### Development Servers
```bash
# In workspace root
npm run dev:backend     # Runs Express REST API on http://localhost:5000
npm run dev:frontend    # Runs Vite + React 19 SPA on http://localhost:5173
```

---

## 👨‍💻 Engineering Profile & Contact

**Hafizi Ahmar**  
*AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Healthcare Foundation*

- **LinkedIn**: [linkedin.com/in/ahmad-hafizi-ahmar](https://www.linkedin.com/in/ahmad-hafizi-ahmar)
- **GitHub**: [github.com/hafiziahmar](https://github.com/hafiziahmar)
- **Direct Recruiter Inquiries**: Verified communication is handled through the **Contact Queue Form** on the portfolio to ensure zero-spam delivery.

---
*Architected and engineered with precision, defensive security, and natural earth ergonomics.*
