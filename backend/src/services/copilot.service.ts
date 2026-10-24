import { portfolioService } from './portfolio.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { GoogleGenAI } from '@google/genai';

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
      return `Hafizi approaches frontend engineering with modern React 19, strict-mode TypeScript, Tailwind CSS v4, and Vite—focusing on deterministic state, referential stability, and responsive user feedback.\n\n` +
        `Rather than relying on legacy boilerplate or untyped component trees, he structures client applications around core architectural pillars:\n\n` +
        `1. **React 19 Paradigms:** Leverages concurrent rendering transitions, optimistic UI updates, and streamlined action states without legacy boilerplate.\n` +
        `2. **Modern Hook Architecture:** Clean separation of concerns using \`useState\` (local state), \`useEffect\` (with strict cleanup functions to avoid memory leaks), \`useRef\` (mutable non-rendering references), \`useMemo\` / \`useCallback\` (deliberate memoization for referential stability), and custom hooks like \`useDebounce\` to reduce high-frequency API storms.\n` +
        `3. **State Management with Zustand:** Eliminates prop-drilling without the heavy boilerplate or full-tree re-renders of React Context. Implements immutable store updates and selector-based subscriptions.\n` +
        `4. **Data-Driven UI States:** Every data-fetching screen explicitly implements all 4 UI states: **Loading** (with skeleton loaders, not just spinners), **Success** (populated data), **Empty** (clear zero-state messaging), and **Error** (resilient fallback with inline retry buttons).\n` +
        `5. **Type Safety (DTOs & Mappers):** Strict TypeScript boundary where raw API DTOs are validated with Type Guards and mapped into clean domain UI models before reaching components.\n\n` +
        `Would you like to explore his component design patterns or see how he manages client-side caching?`;
    }

    // B. TypeScript & Type Systems
    if (q.includes('typescript') || q.includes('types') || q.includes('type system') || q.includes('type safety')) {
      return `TypeScript is a foundational pillar across Hafizi's entire full-stack engineering workflow.\n\n` +
        `For Hafizi, TypeScript isn't just about adding \`: string\` annotations; it represents architectural reliability, defensive domain contracts, and fearless refactoring:\n\n` +
        `1. **End-to-End Type Safety:** In production platforms like URUS, Hafizi leverages TypeScript to establish tight data contracts across database schemas, backend REST DTOs, and frontend UI states.\n` +
        `2. **Defensive Domain Modeling:** Enforces business logic with discriminated unions, mapped types, and strict type guards. In order fulfillment and warehouse state machines, static types guarantee that items can never transition into invalid states.\n` +
        `3. **Confident Refactoring:** Backed by 452 automated unit and integration tests, TypeScript enables rapid architectural refactoring and dependency upgrades without regression anxiety.\n` +
        `4. **Low-Level Rigor Applied to High-Level Code:** Hafizi's intensive background in pure C systems programming at the 42KL Piscine gave him a deep respect for memory layout and deterministic execution—discipline he brings directly into modern TypeScript development.\n\n` +
        `Feel free to ask how he implements Type Guards or handles DTO mapping!`;
    }

    // C. Korea-ASEAN Digital Academy (KADA) Fellowship
    if (q.includes('kada') || q.includes('garranto') || q.includes('korea-asean') || q.includes('korea asean') || q.includes('fellowship')) {
      return `Hafizi was selected as an elite KADA Fellow in the Korea-ASEAN Digital Academy (organized in collaboration with Garranto Academy), focusing on modern full-stack development and applied AI engineering (August – September 2026).\n\n` +
        `The fellowship emphasized production-grade software engineering realities and real-world system architecture:\n\n` +
        `1. **Full-Stack AI-Powered Engineering Curriculum:** Spanned requirements gathering, Domain-Driven Design (DDD), React 19 + TypeScript, Node.js + Express layered REST APIs, Dockerized PostgreSQL, Redis caching, Postman testing, and Swagger/OpenAPI documentation.\n` +
        `2. **Responsible AI-Assisted Development:** Taught disciplined AI prompt engineering across the SDLC (Role, Context, Task, Constraints, Format) and strict code-review standards to prevent unvetted "vibe coding."\n` +
        `3. **The Flagship Capstone — URUS:** Under KADA, Hafizi architected the Outbound Fulfillment & Wave Dispatch Queue for URUS, implementing PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-locking to eliminate double-picking race conditions across warehouse operators, validated across 16 tables and 452 automated tests.\n` +
        `4. **Systems Engineering Transition:** Combined with his earlier foundation at the 42KL Piscine (pure C low-level systems programming), KADA solidified Hafizi's ability to seamlessly bridge low-level computational logic with modern, production-grade cloud web architectures.\n\n` +
        `Would you like to know more about his capstone project URUS or how he applies responsible AI in development?`;
    }

    // D. URUS Capstone SME Operations Platform
    if (q.includes('urus') || q.includes('concurrency') || q.includes('race condition') || q.includes('order') || q.includes('fulfillment') || q.includes('barcode') || q.includes('profit-leak') || q.includes('kpi')) {
      return `URUS is Hafizi's flagship capstone platform—an enterprise-grade SME operations and inventory orchestration engine designed for high-concurrency warehouse environments.\n\n` +
        `Rather than building a basic CRUD prototype, Hafizi engineered URUS to solve high-stakes operational bottlenecks across 16 database tables:\n\n` +
        `1. **Atomic Order-Claiming (Zero Race Conditions):** Implemented PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-level locking to completely eliminate double-picking conflicts between simultaneous warehouse operators on the dispatch floor.\n` +
        `2. **4-Stage Outbound State Machine:** Enforces a strict lifecycle (\`PENDING\` → \`READY_TO_PICK\` → \`PICKING\` → \`PACKING\` → \`FULFILLED\`) backed by real-time barcode scanning for SKU verification and atomic inventory deductions.\n` +
        `3. **Deterministic KPI & Workforce Engine:** Computes transparent productivity rankings using a weighted formula: **40% Output, 30% Accuracy, 20% Efficiency, and 10% Attendance**.\n` +
        `4. **Profit-Leak Detection Agent:** An automated auditing agent that calculates realized margins against product unit costs and classifies anomalies into \`BELOW_COST\`, \`BELOW_FLOOR\`, and \`DISCOUNT_EROSION\`.\n` +
        `5. **Non-Authoritative AI Boundaries:** Assistive AI features (OCR, Copilot) are strictly advisory and cannot mutate inventory or financial records without human verification.\n` +
        `6. **Automated Verification:** Verified across **16 live database tables** and **452 automated tests** across API, web, and client packages.\n\n` +
        `Would you like to explore the database concurrency model, or see how the barcode state machine is implemented?`;
    }

    // E. Backend Architecture & Clean Layered Design
    if (q.includes('backend') || q.includes('architecture') || q.includes('layer') || q.includes('ddd') || q.includes('controller') || q.includes('repository') || q.includes('clean code')) {
      return `Hafizi structures backends using Domain-Driven Design (DDD) principles and a strict 6-layer request lifecycle:\n\n` +
        `\`Route → Middleware → Controller → Service → Repository → Database / Cache\`\n\n` +
        `Each layer maintains a single, well-defined responsibility:\n\n` +
        `1. **Routes & Middleware:** Route URLs map cleanly to controllers, while middleware handles cross-cutting concerns—including CORS allowlisting, Helmet security headers, rate limiting, and JWT authentication.\n` +
        `2. **Controllers:** Parse incoming HTTP requests, validate request shapes, invoke domain services, and return normalized JSON responses with precise HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500).\n` +
        `3. **Services:** House 100% of pure business rules and domain logic (pricing validation, state machine transitions, bonus calculations). Services never touch raw SQL.\n` +
        `4. **Repositories:** The only layer permitted to interact with the database pool (\`pg.Pool\`), encapsulating all SQL queries using parameterized placeholders (\`$1, $2\`) to guarantee SQL injection immunity.\n` +
        `5. **Database & Cache:** PostgreSQL serves as the durable source of truth, accelerated by Redis cache-aside reads.\n\n` +
        `Feel free to ask about his error-handling strategies or connection pool optimization!`;
    }

    // F. Database & Data Integrity (PostgreSQL, Supabase, Docker)
    if (q.includes('database') || q.includes('postgres') || q.includes('supabase') || q.includes('sql') || q.includes('pool') || q.includes('dbeaver') || q.includes('migration')) {
      return `Hafizi treats the database as an active enforcement boundary for data integrity, rather than a passive storage bucket.\n\n` +
        `His relational database design emphasizes strict constraints and deterministic transactions:\n\n` +
        `1. **Relational Normalization:** Designed normalized schemas across users, categories, products, orders, inventory movements, and audit records with strict Primary and Foreign Keys.\n` +
        `2. **Database Constraints:** Uses database-level rules including \`NOT NULL\`, \`UNIQUE\`, and \`CHECK\` constraints (e.g. non-negative stock counts and positive product pricing) so invalid state can never be saved.\n` +
        `3. **Connection Pooling with \`pg.Pool\`:** Reuses a managed pool of database connections to handle concurrent traffic without exhausting server socket limits.\n` +
        `4. **Parameterized Queries:** Always utilizes parameterized queries (\`$1, $2\`) to guarantee absolute protection against SQL Injection vulnerabilities.\n` +
        `5. **Docker & Supabase Ecosystem:** Skilled in spinning up containerized PostgreSQL instances via Docker Compose, running database migrations, seeding test datasets, and managing live schemas via DBeaver.\n\n` +
        `Would you like to know how he handles database migrations or high-concurrency transactions?`;
    }

    // G. Redis Caching & Invalidation
    if (q.includes('redis') || q.includes('cache') || q.includes('caching') || q.includes('invalidation') || q.includes('ttl')) {
      return `Hafizi implements Redis as an in-memory acceleration layer governed by strict cache invalidation protocols:\n\n` +
        `1. **Cache-Aside Pattern:** On read requests, the service checks Redis first (\`products:all\`). On a cache hit, data is served in sub-milliseconds without touching PostgreSQL. On a cache miss, data is queried from PostgreSQL and cached with a Time-To-Live (TTL).\n` +
        `2. **Mandatory Invalidation on Write:** *"A cache without invalidation is a bug waiting for its first UPDATE."* Every mutation (POST, PUT, DELETE) immediately deletes the relevant Redis cache key (\`redisClient.del\`), forcing the next read to fetch fresh authoritative data.\n` +
        `3. **Source of Truth Discipline:** PostgreSQL is the permanent durable source of truth; Redis is treated as a disposable, rebuildable speed layer. If Redis ever restarts, the application continues to function seamlessly.\n\n` +
        `Would you like to know how he organizes cache keys or prevents stale data leaks?`;
    }

    // H. Security, Authentication & Authorization (JWT, bcrypt, RBAC)
    if (q.includes('security') || q.includes('auth') || q.includes('jwt') || q.includes('bcrypt') || q.includes('rbac') || q.includes('cors') || q.includes('helmet')) {
      return `Hafizi builds defensive, hardened backends following the principle of least privilege and strict boundary validation:\n\n` +
        `1. **Irreversible Password Hashing (bcrypt):** Passwords are never stored in plain text or decrypted. They are hashed using **10 salt rounds** with bcrypt and verified using one-way comparisons.\n` +
        `2. **Stateless JWT Authentication:** Issues signed JSON Web Tokens containing user claims and expiration timestamps (\`expiresIn: '24h'\`). Verified via \`Authorization: Bearer <token>\` headers without database round-trips.\n` +
        `3. **Authentication vs. Authorization:** Clearly enforces the boundary:\n` +
        `   - **401 Unauthorized:** *"Who are you?"* (Missing, expired, or invalid token).\n` +
        `   - **403 Forbidden:** *"I know who you are, but you are not allowed to perform this action."* (Role check failed).\n` +
        `4. **Role-Based Access Control (RBAC):** Implemented multi-tier role guards (WORKER, HR, FINANCE, MANAGER, ADMIN) ensuring sensitive domains (payroll, financial records) are strictly siloed from operational workers.\n` +
        `5. **HTTP Hardening:** Layered with CORS domain allowlisting, Helmet security headers, Zod runtime validation, and API rate limiting.\n\n` +
        `Feel free to ask about his token lifecycle or API security testing!`;
    }

    // I. AI Prompt Engineering & Antigravity Workflows
    if (q.includes('prompt') || q.includes('vibe') || q.includes('antigravity') || q.includes('agent') || q.includes('prompt engineering') || q.includes('sdlc')) {
      return `Hafizi practices Responsible AI-Assisted Development rather than unvetted "Vibe Coding."\n\n` +
        `In his workflow, human judgment steers architecture, data modeling, and security, while autonomous AI agents accelerate implementation under rigorous code review:\n\n` +
        `1. **The 5-Ingredient Prompt Specification:** Engineers prompts using the 5 essential pillars: **Role/Persona**, **Context**, **Task**, **Constraints** (libraries allowed/forbidden, naming conventions), and **Output Format**.\n` +
        `2. **Antigravity Autonomous Workflows:** Directs autonomous coding agent hierarchies in Google Antigravity, designing deterministic evaluation harnesses, and verifying code correctness through automated test suites.\n` +
        `3. **Zero-Trust AI Boundaries:** Assistive AI models are never given direct authority to approve financial transactions or overwrite critical state without human or deterministic verification.\n\n` +
        `Ask me how he integrates AI tools into continuous development or CI/CD pipelines!`;
    }

    // J. Clinical Healthcare Background & Career Transition
    if (q.includes('clinical') || q.includes('healthcare') || q.includes('dietetics') || q.includes('transition') || q.includes('uitm') || q.includes('nvc') || q.includes('australia') || q.includes('peneraju')) {
      return `Hafizi brings a rare and powerful hybrid background: a Bachelor of Dietetics (Hons) from UiTM combined with high-rigor full-stack software engineering.\n\n` +
        `His healthcare background directly shapes his software engineering discipline:\n\n` +
        `1. **Clinical Precision & Zero-Tolerance for Error:** In clinical healthcare and aged care operations at NVC Group in Australia (as a prestigious Yayasan Peneraju Scholar), Hafizi operated under strict healthcare compliance frameworks where sloppy data handling directly impacts human well-being. He carries this exact high-stakes discipline into software engineering.\n` +
        `2. **Operational Automation in Practice:** At NVC Group, Hafizi engineered an automated event registration and feedback database system using Google Workspace and Google Apps Script, completely eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.\n` +
        `3. **Why It Matters:** Hafizi doesn't just write code; he understands operational bottlenecks, regulatory compliance, and how to bridge real-world clinical/business workflows into automated, fault-tolerant technical systems.\n\n` +
        `Would you like to know how his clinical background influences his approach to software testing and data integrity?`;
    }

    // K. 42KL Piscine Intensive
    if (q.includes('42') || q.includes('piscine') || q.includes('c language') || q.includes('pointer') || q.includes('memory') || q.includes('algorithm')) {
      return `Hafizi completed the prestigious 42KL Piscine Intensive (April – May 2026), a high-intensity software engineering bootcamp modeled after Ecole 42.\n\n` +
        `The Piscine provided him with foundational low-level engineering grit:\n\n` +
        `1. **Low-Level Imperative Programming:** Programmed extensively in **pure C** with zero third-party libraries, mastering manual memory allocation (\`malloc\` / \`free\`), pointer arithmetic, data structures, and recursion.\n` +
        `2. **Teacherless, Peer-to-Peer Model:** Evaluated under grueling daily code defenses, automated machine grading (Norminette, Moulinette), and intense time constraints.\n` +
        `3. **Foundational Impact:** This low-level training gives Hafizi a deep understanding of memory footprints, runtime complexity, and computer architecture that developers who only learn high-level frameworks rarely possess.\n\n` +
        `Feel free to ask how his low-level C experience enhances his TypeScript and backend architecture!`;
    }

    // L. Why Hire Hafizi / Elevator Pitch
    if (q.includes('why hire') || q.includes('why should') || q.includes('30 second') || q.includes('pitch') || q.includes('unique') || q.includes('stand out') || q.includes('words')) {
      return `Hafizi offers a rare combination of clinical precision, low-level computational grit, and modern production-grade full-stack execution:\n\n` +
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
- Education: KADA Fellow (Korea-ASEAN Digital Academy, organized with Garranto Academy — strictly never expand KADA as "Kita Anak Digital Academy" or any fictional name), 42KL Piscine (pure C systems programming), UiTM (Bachelor of Dietetics Hons).
Formatting & Tone Guidelines:
- Write with conversational warmth and technical rigor.
- Open with an engaging, articulate introductory paragraph framing Hafizi's expertise.
- Structure technical highlights using numbered points with bold concepts (e.g. 1. **Concept Title:** explanation).
- Conclude with an inviting closing question or statement.
- Always use standard Markdown bold with double asterisks (**bold**). Avoid single asterisks for bolding, and avoid raw markdown title markers (###). Use backticks for code and technical identifiers.
Privacy: Do not disclose raw personal phone numbers or private email addresses. Direct recruiters to the portfolio contact form or LinkedIn.
Provide a complete, articulate, and insightful answer directly without overthinking. Never leave thoughts cut off mid-sentence.`;

    try {
      const ai = new GoogleGenAI({ apiKey });

      let interaction: any;
      try {
        // Try with 'low' thinking level for rapid response without 400 error
        interaction = await ai.interactions.create({
          model: 'models/gemini-3.8-flash',
          input: `${systemPrompt}\n\nUser Question: ${question}`,
          generation_config: {
            max_output_tokens: 2048,
            thinking_level: 'low',
          },
        });
      } catch (innerErr: any) {
        // If thinking_level is rejected, fallback to standard config without thinking_level
        logger.warn(`Interactions with thinking_level failed, retrying standard config: ${innerErr.message}`);
        interaction = await ai.interactions.create({
          model: 'models/gemini-3.8-flash',
          input: `${systemPrompt}\n\nUser Question: ${question}`,
          generation_config: {
            max_output_tokens: 2048,
          },
        });
      }

      let text = interaction.output_text || interaction.steps?.at(-1)?.output_text || interaction.outputs?.[0]?.text;
      if (!text && interaction.steps) {
        for (let i = interaction.steps.length - 1; i >= 0; i--) {
          const step = interaction.steps[i];
          if (step.type === 'model_output' && step.content) {
            const parts = step.content.flatMap((c: any) => c.parts || []);
            const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);
            if (textParts.length > 0) {
              text = textParts.join('');
              break;
            }
          }
        }
      }

      if (text && text.trim().length > 0) {
        this.lastDebugInfo = 'Active: GoogleGenAI (gemini-3.8-flash via Interactions API)';
        return text.trim();
      }

      this.lastDebugInfo = `GoogleGenAI returned empty text: ${JSON.stringify(interaction).slice(0, 150)}`;
    } catch (err: any) {
      logger.warn(`GoogleGenAI Interactions error: ${err.message}`);
      this.lastDebugInfo = `GoogleGenAI error: ${err.message}`;
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
