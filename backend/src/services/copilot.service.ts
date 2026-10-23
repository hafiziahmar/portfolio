import { portfolioService } from './portfolio.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class CopilotService {
  public lastDebugInfo: string = 'Initialized';

  async processQuery(question: string, history: ChatMessage[] = []): Promise<string> {
    const portfolio = await portfolioService.getFullPortfolioData();
    const qLower = question.toLowerCase().trim();

    // 1. Instant High-Intelligence Prebuilt Topics (Zero Latency, Unlimited Quota)
    const instantKnowledge = this.matchPrebuiltTopic(qLower, portfolio);
    if (instantKnowledge) {
      this.lastDebugInfo = 'Instant Engine: Verified Technical Knowledge Base';
      return instantKnowledge;
    }

    // 2. Open-Ended Generative AI via Google AI Studio (1,500 daily quota, 12s timeout, 1,500 tokens)
    const rawKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const apiKey = (rawKey || '').trim().replace(/^["']|["']$/g, '');

    if (apiKey !== '') {
      try {
        const aiResponse = await this.callGeminiAPI(question, portfolio, history, apiKey);
        if (aiResponse) return aiResponse;
      } catch (err: any) {
        this.lastDebugInfo = `Gemini call exception: ${err.message}`;
        logger.warn('Gemini API call failed, falling back to general CV knowledge:', err.message);
      }
    } else {
      this.lastDebugInfo = 'No GEMINI_API_KEY configured';
    }

    // 3. Fallback to General Overview
    return this.getGeneralOverview(portfolio);
  }

  private matchPrebuiltTopic(q: string, portfolio: any): string | null {
    // A. React 19, Modern Frontend & Hooks
    if (q.includes('react 19') || q.includes('react') || q.includes('frontend') || q.includes('hook') || q.includes('zustand') || q.includes('vite') || q.includes('tailwind')) {
      return `### React 19 & Modern Frontend Engineering\n\n` +
        `Hafizi builds client-side applications with modern **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, and **Vite**.\n\n` +
        `**Key Architectural Concepts from His Engineering Stack:**\n` +
        `- **React 19 Paradigms:** Leverages concurrent rendering transitions, optimistic UI updates, and streamlined action states without legacy boilerplate.\n` +
        `- **Modern Hook Architecture:** Clean separation of concerns using \`useState\` (local state), \`useEffect\` (with strict cleanup functions to avoid memory leaks), \`useRef\` (mutable non-rendering references), \`useMemo\` / \`useCallback\` (deliberate memoization for referential stability), and custom hooks like \`useDebounce\` to reduce high-frequency API storms.\n` +
        `- **State Management with Zustand:** Eliminates prop-drilling without the heavy boilerplate or full-tree re-renders of React Context. Implements immutable store updates and selector-based subscriptions.\n` +
        `- **Data-Driven UI States:** Every data-fetching screen explicitly implements all 4 UI states: **Loading** (with skeleton loaders, not just spinners), **Success** (populated data), **Empty** (clear zero-state messaging), and **Error** (resilient fallback with inline retry buttons).\n` +
        `- **Type Safety (DTOs & Mappers):** Strict TypeScript boundary where raw API DTOs are validated with Type Guards and mapped into clean domain UI models before reaching components.`;
    }

    // B. URUS Capstone SME Operations Platform
    if (q.includes('urus') || q.includes('concurrency') || q.includes('race condition') || q.includes('order') || q.includes('fulfillment') || q.includes('barcode') || q.includes('profit-leak') || q.includes('kpi')) {
      return `### URUS — All-In-One SME Operations Platform (Capstone)\n\n` +
        `**URUS** is an enterprise-grade operational platform connecting inventory movement, warehouse fulfillment, workforce attendance, KPI measurement, expense auditing, and payroll for stock-based SMEs.\n\n` +
        `**Technical Highlights & Verified Architecture:**\n` +
        `- **Atomic Order-Claiming (Zero Race Conditions):** Implemented PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-level locking to completely eliminate double-picking conflicts between simultaneous warehouse operators on the dispatch floor.\n` +
        `- **4-Stage Outbound State Machine:** Strict lifecycle enforcement (\`PENDING\` → \`READY_TO_PICK\` → \`PICKING\` → \`PACKING\` → \`FULFILLED\`) backed by real-time barcode scanning for SKU verification and atomic inventory deductions.\n` +
        `- **Deterministic KPI & Workforce Engine:** Computes non-hallucinatory productivity rankings using a transparent weighted formula: **40% Output, 30% Accuracy, 20% Efficiency, and 10% Attendance**.\n` +
        `- **Profit-Leak Detection Agent:** An automated auditing agent that calculates realized margins against product unit costs and classifies anomalies into \`BELOW_COST\`, \`BELOW_FLOOR\`, and \`DISCOUNT_EROSION\`.\n` +
        `- **Non-Authoritative AI Boundaries:** Assistive AI surfaces (OCR, Copilot) are strictly non-authoritative and cannot independently approve financial transactions or overwrite inventory records without human verification.\n` +
        `- **Automated Verification:** Verified across **16 live database tables** and **452 automated tests** across API, web, and client packages.`;
    }

    // C. Backend Architecture & Clean Layered Design
    if (q.includes('backend') || q.includes('architecture') || q.includes('layer') || q.includes('ddd') || q.includes('controller') || q.includes('repository') || q.includes('clean code')) {
      return `### Enterprise Layered Backend Architecture\n\n` +
        `Hafizi structures backends using Domain-Driven Design (DDD) principles and a strict **6-Layer Request Lifecycle**:\n\n` +
        `\`Route → Middleware → Controller → Service → Repository → Database / Cache\`\n\n` +
        `**Role of Each Layer:**\n` +
        `- **Routes:** Map incoming HTTP URLs and methods to specific controllers.\n` +
        `- **Middleware:** Cross-cutting concerns that run before business logic—including CORS allowlisting, Helmet security headers, rate limiting, and authentication/authorization checks.\n` +
        `- **Controllers:** Parse HTTP requests, validate input shapes, invoke the appropriate domain service, and format normalized JSON responses with correct HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500).\n` +
        `- **Services:** Contain 100% of the pure business rules and domain logic (e.g., price validation, state machine transitions, bonus calculations). Services never touch raw SQL.\n` +
        `- **Repositories:** The **only layer** permitted to interact with the database pool (\`pg.Pool\`). Encapsulates all SQL queries using parameterized placeholders to prevent SQL injection.\n` +
        `- **Database & Cache:** PostgreSQL as the durable source of truth, backed by Redis for high-frequency reads.`;
    }

    // D. Database & Data Integrity (PostgreSQL, Supabase, Docker)
    if (q.includes('database') || q.includes('postgres') || q.includes('supabase') || q.includes('sql') || q.includes('pool') || q.includes('dbeaver') || q.includes('migration')) {
      return `### PostgreSQL & Data Integrity Architecture\n\n` +
        `Hafizi treats the database as an active enforcement boundary for data integrity, rather than a passive storage bucket:\n\n` +
        `- **Relational Normalization:** Designed normalized schemas across users, categories, products, orders, inventory movements, and audit records with strict Primary and Foreign Keys.\n` +
        `- **Database Constraints:** Uses database-level rules including \`NOT NULL\`, \`UNIQUE\`, and \`CHECK\` constraints (e.g. non-negative stock counts and positive product pricing) so invalid state can never be saved.\n` +
        `- **Connection Pooling with \`pg.Pool\`:** Reuses a managed pool of database connections to handle concurrent traffic without exhausting server socket limits.\n` +
        `- **Parameterized Queries:** Always utilizes parameterized queries (\`$1, $2\`) to guarantee absolute protection against SQL Injection vulnerabilities.\n` +
        `- **Docker & Supabase Ecosystem:** Skilled in spinning up containerized PostgreSQL instances via Docker Compose, running database migrations, seeding test datasets, and managing live schemas via DBeaver.`;
    }

    // E. Redis Caching & Invalidation
    if (q.includes('redis') || q.includes('cache') || q.includes('caching') || q.includes('invalidation') || q.includes('ttl')) {
      return `### High-Throughput Redis Caching & Cache Invalidation\n\n` +
        `Hafizi implements Redis as an in-memory acceleration layer with strict invalidation protocols:\n\n` +
        `- **Cache-Aside Pattern:** On read requests, the service checks Redis first (\`products:all\`). On a cache hit, data is served in sub-milliseconds without touching PostgreSQL. On a cache miss, data is queried from PostgreSQL and cached with a Time-To-Live (TTL).\n` +
        `- **Mandatory Invalidation on Write:** *"A cache without invalidation is a bug waiting for its first UPDATE."* Every mutation (POST, PUT, DELETE) immediately deletes the relevant Redis cache key (\`redisClient.del\`), forcing the next read to fetch fresh authoritative data.\n` +
        `- **Source of Truth Discipline:** PostgreSQL is the permanent durable source of truth; Redis is treated as a disposable, rebuildable speed layer. If Redis ever restarts, the application continues to function seamlessly.`;
    }

    // F. Security, Authentication & Authorization (JWT, bcrypt, RBAC)
    if (q.includes('security') || q.includes('auth') || q.includes('jwt') || q.includes('bcrypt') || q.includes('rbac') || q.includes('cors') || q.includes('helmet')) {
      return `### Security, Authentication & Role-Based Authorization\n\n` +
        `Hafizi builds defensive, hardened backends following the principle of least privilege:\n\n` +
        `- **Irreversible Password Hashing (bcrypt):** Passwords are never stored in plain text or decrypted. They are hashed using **10 salt rounds** with bcrypt and verified using one-way comparisons.\n` +
        `- **Stateless JWT Authentication:** Issues signed JSON Web Tokens containing user claims and expiration timestamps (\`expiresIn: '24h'\`). Verified via \`Authorization: Bearer <token>\` headers without database round-trips.\n` +
        `- **Authentication vs. Authorization:** Clearly enforces the boundary:\n` +
        `  * **401 Unauthorized:** *"Who are you?"* (Missing, expired, or invalid token).\n` +
        `  * **403 Forbidden:** *"I know who you are, but you are not allowed to perform this action."* (Role check failed).\n` +
        `- **Role-Based Access Control (RBAC):** Implemented multi-tier role guards (WORKER, HR, FINANCE, MANAGER, ADMIN) ensuring sensitive domains (payroll, financial records) are strictly siloed from operational workers.\n` +
        `- **HTTP Hardening:** Layered with CORS domain allowlisting, Helmet security headers, Zod runtime validation, and API rate limiting.`;
    }

    // G. AI Prompt Engineering & Antigravity Workflows
    if (q.includes('prompt') || q.includes('vibe') || q.includes('antigravity') || q.includes('agent') || q.includes('prompt engineering') || q.includes('sdlc')) {
      return `### AI Prompt Engineering & Responsible Agentic Development\n\n` +
        `Hafizi practices **Responsible AI-Assisted Development** rather than reckless "Vibe Coding":\n\n` +
        `- **Responsible AI vs. Vibe Coding:** In Vibe Coding, developers blindly paste AI code without understanding it. In Responsible AI-Assisted Development, **human judgment leads architecture and design**, while autonomous AI agents accelerate implementation under rigorous code review.\n` +
        `- **The 5-Ingredient Prompt Specification:** Engineers prompts using the 5 essential pillars: **Role/Persona**, **Context**, **Task**, **Constraints** (libraries allowed/forbidden, naming conventions), and **Output Format**.\n` +
        `- **Antigravity Autonomous Workflows:** Directs autonomous coding agent hierarchies in Google Antigravity, designing deterministic evaluation harnesses, and verifying code correctness through automated test suites.`;
    }

    // H. Clinical Healthcare Background & Career Transition
    if (q.includes('clinical') || q.includes('healthcare') || q.includes('dietetics') || q.includes('transition') || q.includes('uitm') || q.includes('nvc') || q.includes('australia') || q.includes('peneraju')) {
      return `### The Clinical-to-Software Engineering Advantage\n\n` +
        `Hafizi brings a rare and powerful hybrid background: a **Bachelor of Dietetics (Hons.) from UiTM** combined with high-rigor **full-stack software engineering**:\n\n` +
        `- **Clinical Precision & Zero-Tolerance for Error:** In clinical healthcare and aged care operations at NVC Group in Australia (as a prestigious Yayasan Peneraju Scholar), Hafizi operated under strict healthcare compliance frameworks where sloppy data handling directly impacts human well-being. He carries this exact high-stakes discipline into software engineering.\n` +
        `- **Operational Automation in Practice:** At NVC Group, Hafizi engineered an automated event registration and feedback database system using Google Workspace and Google Apps Script, completely eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.\n` +
        `- **Why It Matters:** Hafizi doesn't just write code; he understands operational bottlenecks, regulatory compliance, and how to bridge real-world clinical/business workflows into automated, fault-tolerant technical systems.`;
    }

    // I. 42KL Piscine Intensive
    if (q.includes('42') || q.includes('piscine') || q.includes('c language') || q.includes('pointer') || q.includes('memory') || q.includes('algorithm')) {
      return `### 42KL Piscine Intensive — Low-Level Systems Rigor\n\n` +
        `Hafizi completed the prestigious **42KL Piscine Intensive (April – May 2026)**:\n\n` +
        `- **Low-Level Imperative Programming:** Programmed extensively in **pure C** with zero third-party libraries, mastering manual memory allocation (\`malloc\` / \`free\`), pointer arithmetic, data structures, and recursion.\n` +
        `- **Teacherless, Peer-to-Peer Model:** Evaluated under grueling daily code defenses, automated machine grading (Norminette, Moulinette), and intense time constraints.\n` +
        `- **Foundational Impact:** This low-level training gives Hafizi a deep understanding of memory footprints, runtime complexity, and computer architecture that developers who only learn high-level frameworks rarely possess.`;
    }

    // J. Why Hire Hafizi / Elevator Pitch
    if (q.includes('why hire') || q.includes('why should') || q.includes('30 second') || q.includes('pitch') || q.includes('unique') || q.includes('stand out') || q.includes('words')) {
      return `### Why You Should Interview Hafizi Ahmar\n\n` +
        `If you have only 30 seconds, here is why Hafizi stands out:\n\n` +
        `1. **Rare Hybrid of Clinical Discipline & Systems Engineering:** Holds a Clinical Dietetics degree (UiTM) and international healthcare experience (NVC Group Australia), giving him exceptional analytical precision, high error-tolerance discipline, and strong communication skills.\n` +
        `2. **Low-Level Systems Grounding:** Trained in pure C at the intense **42KL Piscine**, understanding memory management and algorithmic efficiency from the metal up.\n` +
        `3. **Modern Production Full-Stack Execution:** Mastered the full stack (React 19, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker) through the Korea-ASEAN Digital Academy (KADA) and delivered **URUS**, a 16-table operations platform with 452 passing automated tests.\n` +
        `4. **AI-Enabled Engineering Leader:** Proficient in directing autonomous coding agents in Google Antigravity and applying structured prompt engineering to build enterprise software at 3x speed without compromising code quality.\n\n` +
        `Hafizi is available for **Full-Stack & AI Engineering roles**. Connect with him directly through the Contact Form below or via [LinkedIn](${portfolio.profile?.linkedin_url || 'https://www.linkedin.com/in/ahmad-hafizi-ahmar'})!`;
    }

    return null;
  }

  private async callGeminiAPI(question: string, portfolio: any, history: ChatMessage[], apiKey: string): Promise<string | null> {
    if (!apiKey) {
      this.lastDebugInfo = 'Empty API key';
      return null;
    }

    const systemPrompt = `You are Toph, the official AI CV Copilot representing Hafizi Ahmar.
You speak on behalf of Hafizi with warmth, technical precision, high intelligence, and professional advocacy.
You have complete context on his verified background:
- Full-Stack Stack: React 19, TypeScript, TailwindCSS v4, Node.js, Express, PostgreSQL, Redis, Docker, Supabase.
- Capstone Project: URUS (Integrated SME Operations Platform, PostgreSQL FOR UPDATE SKIP LOCKED row-locking, barcode pipeline, 452 automated tests).
- Professional Experience: NVC Group Australia (clinical operations & Google Apps Script automation), Puncak Niaga, Prudential, MAFI, MDEC.
- Education: KADA Fellow (AI Full-Stack), 42KL Piscine (pure C systems programming), UiTM (Bachelor of Dietetics Hons).
Privacy: Do not disclose raw personal phone numbers or private email addresses. Direct recruiters to the portfolio contact form or LinkedIn.
Provide a complete, articulate, and insightful answer. Never leave thoughts cut off mid-sentence.`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    };

    const candidateModels = [
      'gemma-4-31b-it',
      'gemma-4-26b-a4b-it',
      'gemini-2.5-flash',
    ];

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(12000), // Generous 12-second allowance for complete AI response
          }
        );

        if (response.ok) {
          const data: any = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            this.lastDebugInfo = `Active: Google AI (${model})`;
            return text.trim();
          }
        }
      } catch (err: any) {
        logger.warn(`API call on ${model}: ${err.message}`);
      }
    }

    return null;
  }

  private getGeneralOverview(portfolio: any): string {
    return `Hello! I am Toph, Hafizi Ahmar's AI CV Copilot.\n\n` +
      `Hafizi is an **AI-Enabled Full-Stack Developer** bridging clinical precision with modern software engineering.\n\n` +
      `Here are some topics I can answer for you instantly:\n` +
      `- **"Tell me about React 19"** — His frontend architecture, state management with Zustand, and modern hooks.\n` +
      `- **"Explain the URUS project"** — Concurrency control with PostgreSQL row-locking, barcode pipeline, and 452 automated tests.\n` +
      `- **"Why should we hire Hafizi?"** — A 30-second summary synthesizing his clinical, 42KL C programming, and full-stack background.\n` +
      `- **"Backend & Database Design"** — Clean layered architecture, PostgreSQL connection pools, and Redis cache invalidation.\n` +
      `- **"Clinical background"** — How his UiTM Dietetics degree and NVC Group operations translate into software reliability.\n\n` +
      `How can I assist your review of Hafizi's profile today?`;
  }
}

export const copilotService = new CopilotService();
