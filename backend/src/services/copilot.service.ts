import { portfolioService } from './portfolio.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface InternalTopic {
  id: string;
  keywords: string[];
  title: string;
  body: string;
  relatedIds: string[];
  suggestPrompt: string;
}

export const TOPICS: InternalTopic[] = [
  // ==========================================
  // PILLAR 1: CAREER JOURNEY & LEADERSHIP
  // ==========================================
  {
    id: 'why_hire',
    keywords: ['why hire', 'why should', '30 second', 'pitch', 'stand out', 'hire', 'candidate'],
    title: 'Why You Should Interview Hafizi Ahmar',
    body: `Hafizi offers a rare combination of clinical precision, low-level computational grit, and modern production-grade full-stack execution:\n\n` +
      `1. **Rare Hybrid of Clinical Discipline & Systems Engineering:** Holds a Clinical Dietetics degree (UiTM) and operational healthcare experience at NVC Group, giving him exceptional analytical precision, high error-tolerance discipline, and strong communication skills.\n` +
      `2. **Low-Level Systems Grounding:** Trained in pure C at the intense **42KL Piscine**, understanding memory management and algorithmic efficiency from the metal up.\n` +
      `3. **Modern Production Full-Stack Execution:** Mastered the full stack (React 19, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker) through the Korea-ASEAN Digital Academy (KADA) and delivered **URUS**, a 16-table operations platform with 452 passing automated tests.\n` +
      `4. **AI-Enabled Engineering Leader:** Proficient in directing autonomous coding agents in Google Antigravity and applying structured prompt engineering to build enterprise software at 3x speed without compromising code quality.`,
    relatedIds: ['urus_overview', 'react19', 'capabilities', 'portfolio_architecture', 'clinical'],
    suggestPrompt: 'a 30-second summary of why Hafizi would be an exceptional addition to your engineering team',
  },
  {
    id: 'clinical',
    keywords: ['clinical', 'dietetics', 'healthcare', 'uitm', 'medical', 'hospital'],
    title: 'Clinical Healthcare to Software Engineering Bridge',
    body: `Hafizi brings a rare and powerful hybrid background: a Bachelor of Dietetics (Hons) from UiTM combined with high-rigor full-stack software engineering.\n\n` +
      `His healthcare background directly shapes his software engineering discipline:\n\n` +
      `1. **Clinical Precision & Zero-Tolerance for Error:** In clinical healthcare environments where biochemical calculations directly impact patient health, Hafizi cultivated a zero-tolerance approach to sloppy data handling—discipline he carries into database constraints, type guards, and defensive coding.\n` +
      `2. **Biochemical Data Analysis:** Trained to parse messy, multi-variable laboratory inputs into structured treatment plans, mirroring how software engineers normalize external API streams and database schemas.\n` +
      `3. **High-Empathy User Workflows:** Working with clinical patients honed exceptional active listening and diagnostic skills, enabling Hafizi to translate non-technical business pain points into elegant, resilient software architectures.`,
    relatedIds: ['nvc', 'takaful', 'puncak_niaga', 'postgres'],
    suggestPrompt: 'explore how his clinical dietetics background translates into zero-tolerance software discipline',
  },
  {
    id: 'nvc',
    keywords: ['nvc', 'nvc group', 'apps script', 'aged care', 'registration system', 'compliance'],
    title: 'NVC Group — Operations & Google Apps Script Automation',
    body: `At NVC Group, Hafizi operated under strict international healthcare compliance frameworks while spearheading operational automation initiatives:\n\n` +
      `1. **Zero-Manual Data Entry Pipeline:** Engineered an automated event registration and database feedback pipeline utilizing Google Workspace and Google Apps Script, eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.\n` +
      `2. **International Healthcare Compliance:** Selected as a competitive Yayasan Peneraju International Scholar, mastering strict Australian aged-care compliance frameworks and adapting protocols to global operational standards.\n` +
      `3. **Early AI-Assisted Prototyping:** Leveraged structured prompt engineering with LLM assistants to accelerate script writing and prototype operational workflows, bridging healthcare processes with modern technical automation.`,
    relatedIds: ['clinical', 'puncak_niaga', 'prompt_ai', 'urus_overview'],
    suggestPrompt: 'learn about his Google Apps Script automation and operations at NVC Group',
  },
  {
    id: 'takaful',
    keywords: ['takaful', 'prudential', 'insurance', 'financial', 'risk', 'crm', 'client portfolio'],
    title: 'Prudential BSN Takaful — Financial Domain Rigor & Risk Evaluation',
    body: `At Prudential BSN Takaful Berhad, Hafizi managed client portfolios, performed quantitative risk evaluations, and navigated strict financial compliance frameworks.\n\n` +
      `In software engineering, this domain experience directly translates into architectural discipline:\n\n` +
      `1. **Defensive Domain Logic:** Financial calculations allow zero tolerance for rounding errors or unhandled edge cases. Hafizi treats software business rules with this same rigor—ensuring non-negative ledger constraints and atomic database updates.\n` +
      `2. **Enterprise CRM & Data Pipelines:** Utilized internal enterprise software and CRM systems to manage multi-tiered client data, giving him practical empathy for end-user data entry pain points and workflow bottlenecks.\n` +
      `3. **Regulatory & Compliance-First Mindset:** Accustomed to operating within audited financial frameworks—habits that directly inform his approach to database access controls (RBAC) and data protection.`,
    relatedIds: ['puncak_niaga', 'clinical', 'security', 'postgres'],
    suggestPrompt: 'explore his experience with financial risk modeling at Prudential BSN Takaful',
  },
  {
    id: 'puncak_niaga',
    keywords: ['puncak niaga', 'puncak', 'project executive', 'procurement', 'vendor', 'budget', 'leadership', 'velocity'],
    title: 'Puncak Niaga Holdings — Project Velocity, Budgets & Team Leadership',
    body: `As a Project Executive at Puncak Niaga Holdings Berhad, Hafizi directed end-to-end planning, resource allocation, and site execution for major landscaping infrastructure projects at Masjid Puncak Alam and Ma'ahad Tahfiz Ismail.\n\n` +
      `This operational leadership directly strengthens his full-stack delivery capabilities:\n\n` +
      `1. **Cross-Functional Team Direction:** Led and supervised a multi-cultural team of 10+ operational workers on the ground, optimizing daily workflow sequences and resolving on-site blockers.\n` +
      `2. **Asset, Inventory & Procurement Management:** Formulated project budgets, negotiated supplier contracts, and managed physical asset tracking—hands-on experience that directly inspired the inventory and fulfillment workflows he later automated in his capstone platform, URUS.\n` +
      `3. **Executive Reporting & Delivery Velocity:** Reported directly to the Director on project milestones, budget burn, and delivery velocity, cultivating clear communication with non-technical stakeholders.`,
    relatedIds: ['urus_overview', 'takaful', 'mdec', 'git'],
    suggestPrompt: 'know about his project velocity and budget management at Puncak Niaga',
  },
  {
    id: 'mafi',
    keywords: ['mafi', 'myfutureagro', 'smart farming', 'fertigation', 'agriculture', 'iot', 'automation infrastructure'],
    title: 'Ministry of Agriculture (MAFI) — Automated Smart Farming Infrastructure',
    body: `Through the Ministry of Agriculture and Food Industries (MAFI) MyFutureAgro initiative, Hafizi was selected for a competitive agricultural technology program focused on smart farming infrastructures.\n\n` +
      `His work bridged physical engineering with automated process controls:\n\n` +
      `1. **Commercial Deployment from Scratch:** Co-engineered and constructed a commercial one-acre chili cultivation facility from the ground up, deploying physical piping, pressure regulators, and automated fertigation systems.\n` +
      `2. **Deterministic Delivery Systems:** Configured automated nutrient and water delivery schedules, translating environmental inputs into scheduled mechanical operations.\n` +
      `3. **Engineering Tenacity:** Demonstrates Hafizi's willingness to get his hands dirty, solve tangible logistical problems, and deploy physical systems that must run reliably in demanding environments.`,
    relatedIds: ['puncak_niaga', 'nvc', 'mdec', 'urus_barcode'],
    suggestPrompt: 'hear about his automated smart farming and fertigation work with MAFI',
  },
  {
    id: 'mdec',
    keywords: ['mdec', 'glow', 'penjana', 'freelance', 'remote delivery', 'marketplace'],
    title: 'MDEC GLOW PENJANA — Global Remote Delivery & Asynchronous Workflows',
    body: `Through the Malaysia Digital Economy Corporation (MDEC) Global Online Workforce (GLOW PENJANA) initiative, Hafizi completed specialized training on high-standard remote delivery and digital marketplace positioning.\n\n` +
      `Key engineering and operational disciplines gained:\n\n` +
      `1. **Remote Work & Communication Discipline:** Trained in asynchronous team communication, digital workspace management, and independent sprint execution.\n` +
      `2. **Cross-Border Service Delivery:** Formulated structured outreach frameworks and clear client documentation standards for international stakeholder alignment.\n` +
      `3. **Autonomous Project Ownership:** Reinforced the ability to take ambiguous product requirements and translate them into well-defined, independently executed software deliverables.`,
    relatedIds: ['puncak_niaga', 'git', 'prompt_ai', 'kada'],
    suggestPrompt: 'explore his remote project execution experience through MDEC GLOW',
  },
  {
    id: '42kl',
    keywords: ['42kl', '42', 'piscine', 'c programming', 'memory', 'pointer', 'malloc', 'algorithm'],
    title: '42KL Piscine Intensive — Low-Level Systems Rigor & Pure C',
    body: `Hafizi completed the prestigious 42KL Piscine Intensive (April – May 2026), a high-intensity software engineering bootcamp modeled after Ecole 42.\n\n` +
      `The Piscine provided him with foundational low-level engineering grit:\n\n` +
      `1. **Low-Level Imperative Programming:** Programmed extensively in **pure C** with zero third-party libraries, mastering manual memory allocation (\`malloc\` / \`free\`), pointer arithmetic, data structures, and recursion.\n` +
      `2. **Teacherless, Peer-to-Peer Model:** Evaluated under grueling daily code defenses, automated machine grading (Norminette, Moulinette), and intense time constraints.\n` +
      `3. **Deep Computational Intuition:** This low-level training gives Hafizi an intuitive grasp of memory layout, runtime complexity, and computer architecture that developers who only learn high-level frameworks rarely possess.`,
    relatedIds: ['typescript', 'kada', 'postgres', 'backend_layers'],
    suggestPrompt: 'explore his pure C systems programming training at the 42KL Piscine',
  },
  {
    id: 'kada',
    keywords: ['kada', 'garranto', 'fellowship', 'talent accelerator', 'korea-asean', 'korea asean'],
    title: 'Korea-ASEAN Digital Academy (KADA) Fellowship',
    body: `Hafizi was selected as an elite KADA Fellow in the Korea-ASEAN Digital Academy (organized in collaboration with Garranto Academy), focusing on modern full-stack development and applied AI engineering (August – September 2026).\n\n` +
      `The fellowship emphasized production-grade software engineering realities and real-world system architecture:\n\n` +
      `1. **Full-Stack AI-Powered Engineering Curriculum:** Spanned requirements gathering, Domain-Driven Design (DDD), React 19 + TypeScript, Node.js + Express layered REST APIs, Dockerized PostgreSQL, Redis caching, Postman testing, and Swagger/OpenAPI documentation.\n` +
      `2. **Responsible AI-Assisted Development:** Taught disciplined AI prompt engineering across the SDLC (Role, Context, Task, Constraints, Format) and strict code-review standards to prevent unvetted "vibe coding."\n` +
      `3. **The Flagship Capstone — URUS:** Under KADA, Hafizi architected the Outbound Fulfillment & Wave Dispatch Queue for URUS, implementing PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-locking to eliminate double-picking race conditions across warehouse operators, validated across 16 tables and 452 automated tests.\n` +
      `4. **Systems Engineering Transition:** Combined with his earlier foundation at the 42KL Piscine (pure C low-level systems programming), KADA solidified Hafizi's ability to seamlessly bridge low-level computational logic with modern, production-grade cloud web architectures.`,
    relatedIds: ['urus_overview', 'react19', 'prompt_ai', 'backend_layers'],
    suggestPrompt: 'know more about his KADA Fellowship in AI-enabled full-stack development',
  },

  // ==========================================
  // PILLAR 2: CAPSTONE PLATFORM (URUS)
  // ==========================================
  {
    id: 'urus_overview',
    keywords: ['urus', 'capstone', 'concurrency', 'skip locked', 'race condition', 'double picking', 'order-claiming'],
    title: 'URUS — High-Concurrency SME Operations Platform',
    body: `URUS is Hafizi's flagship capstone platform—an enterprise-grade SME operations and inventory orchestration engine designed for high-concurrency warehouse environments.\n\n` +
      `Rather than building a basic CRUD prototype, Hafizi engineered URUS to solve high-stakes operational bottlenecks across 16 database tables:\n\n` +
      `1. **Atomic Order-Claiming (Zero Race Conditions):** Implemented PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-level locking to completely eliminate double-picking conflicts between simultaneous warehouse operators on the dispatch floor.\n` +
      `2. **4-Stage Outbound State Machine:** Enforces a strict lifecycle (\`PENDING\` → \`READY_TO_PICK\` → \`PICKING\` → \`PACKING\` → \`FULFILLED\`) backed by real-time barcode scanning for SKU verification and atomic inventory deductions.\n` +
      `3. **Deterministic KPI & Workforce Engine:** Computes transparent productivity rankings using a weighted formula: **40% Output, 30% Accuracy, 20% Efficiency, and 10% Attendance**.\n` +
      `4. **Automated Verification:** Verified across **16 live database tables** and **452 automated tests** across API, web, and client packages.`,
    relatedIds: ['urus_barcode', 'urus_kpi', 'postgres', 'backend_layers'],
    suggestPrompt: 'explore his URUS concurrency architecture and row-locking model',
  },
  {
    id: 'urus_barcode',
    keywords: ['barcode', 'camera', 'sku scanning', 'dispatch queue', 'canvas stream', 'sku'],
    title: 'URUS — Camera Barcode Scanner & Hardware Processing Pipeline',
    body: `In his capstone platform URUS, Hafizi engineered a zero-collision warehouse fulfillment queue featuring camera-based barcode scanning:\n\n` +
      `1. **Browser Camera Stream Decoding:** Integrated device camera feeds to decode physical 1D/2D SKU barcodes in real time using HTML5 canvas buffers, avoiding the need for expensive proprietary warehouse scanners.\n` +
      `2. **Debounced SKU Validation:** Implemented strict input debouncing and audio-visual feedback loops so rapid multi-item scanning prevents accidental duplicate reads.\n` +
      `3. **Optimistic Inventory Deduction:** Once a valid barcode match is confirmed, the system verifies stock against the 4-stage outbound state machine and issues atomic inventory deduction events to the database.`,
    relatedIds: ['urus_overview', 'urus_kpi', 'react19', 'postgres'],
    suggestPrompt: 'see how the URUS camera barcode pipeline decodes SKUs in real time',
  },
  {
    id: 'urus_kpi',
    keywords: ['kpi', 'profit leak', 'auditing agent', 'workforce attendance', 'margin', 'below_cost'],
    title: 'URUS — Deterministic KPI & Profit-Leak Auditing Engine',
    body: `Within URUS, Hafizi implemented deterministic operational auditing and workforce productivity evaluation:\n\n` +
      `1. **Mathematical KPI Formula:** Eliminates subjective evaluation by computing employee productivity through a transparent, weighted formula: **40% Output, 30% Accuracy, 20% Efficiency, and 10% Attendance**.\n` +
      `2. **Profit-Leak Detection Agent:** Built an automated auditing agent that compares realized sale margins against product unit costs, flagging anomalies into \`BELOW_COST\`, \`BELOW_FLOOR\`, and \`DISCOUNT_EROSION\` categories.\n` +
      `3. **Non-Authoritative AI Boundaries:** Assistive AI surfaces (OCR, Copilot) are strictly advisory and cannot mutate inventory or financial records without human verification.`,
    relatedIds: ['urus_overview', 'urus_barcode', 'prompt_ai', 'postgres'],
    suggestPrompt: 'explore how URUS computes deterministic workforce KPIs and audits profit leaks',
  },

  // ==========================================
  // PILLAR 3: CORE FULL-STACK ARCHITECTURE
  // ==========================================
  {
    id: 'react19',
    keywords: ['react 19', 'react', 'frontend', 'zustand', 'vite', 'tailwind', 'hook'],
    title: 'React 19 & Modern Frontend Architecture',
    body: `Hafizi approaches frontend engineering with modern React 19, strict-mode TypeScript, Tailwind CSS v4, and Vite—focusing on deterministic state, referential stability, and responsive user feedback.\n\n` +
      `Rather than relying on legacy boilerplate or untyped component trees, he structures client applications around core architectural pillars:\n\n` +
      `1. **React 19 Paradigms:** Leverages concurrent rendering transitions, optimistic UI updates, and streamlined action states without legacy boilerplate.\n` +
      `2. **Modern Hook Architecture:** Clean separation of concerns using \`useState\` (local state), \`useEffect\` (with strict cleanup functions to avoid memory leaks), \`useRef\` (mutable non-rendering references), \`useMemo\` / \`useCallback\` (deliberate memoization for referential stability), and custom hooks like \`useDebounce\` to reduce high-frequency API storms.\n` +
      `3. **State Management with Zustand:** Eliminates prop-drilling without the heavy boilerplate or full-tree re-renders of React Context. Implements immutable store updates and selector-based subscriptions.\n` +
      `4. **Data-Driven UI States:** Every data-fetching screen explicitly implements all 4 UI states: **Loading** (with skeleton loaders, not just spinners), **Success** (populated data), **Empty** (clear zero-state messaging), and **Error** (resilient fallback with inline retry buttons).\n` +
      `5. **Type Safety (DTOs & Mappers):** Strict TypeScript boundary where raw API DTOs are validated with Type Guards and mapped into clean domain UI models before reaching components.`,
    relatedIds: ['typescript', 'portfolio_architecture', 'zod', 'backend_layers'],
    suggestPrompt: 'explore his React 19 concurrent transitions and Zustand store architecture',
  },
  {
    id: 'typescript',
    keywords: ['typescript', 'types', 'type safety', 'type guard', 'domain model'],
    title: 'TypeScript & Defensive Domain Modeling',
    body: `TypeScript is a foundational pillar across Hafizi's entire full-stack engineering workflow.\n\n` +
      `For Hafizi, TypeScript isn't just about adding \`: string\` annotations; it represents architectural reliability, defensive domain contracts, and fearless refactoring:\n\n` +
      `1. **End-to-End Type Safety:** In production platforms like URUS, Hafizi leverages TypeScript to establish tight data contracts across database schemas, backend REST DTOs, and frontend UI states.\n` +
      `2. **Defensive Domain Modeling:** Enforces business logic with discriminated unions, mapped types, and strict type guards. In order fulfillment and warehouse state machines, static types guarantee that items can never transition into invalid states.\n` +
      `3. **Confident Refactoring:** Backed by 452 automated unit and integration tests, TypeScript enables rapid architectural refactoring and dependency upgrades without regression anxiety.\n` +
      `4. **Low-Level Rigor Applied to High-Level Code:** Hafizi's intensive background in pure C systems programming at the 42KL Piscine gave him a deep respect for memory layout and deterministic execution—discipline he brings directly into modern TypeScript development.`,
    relatedIds: ['zod', 'react19', 'backend_layers', '42kl'],
    suggestPrompt: 'see how he applies TypeScript for defensive domain modeling and type safety',
  },
  {
    id: 'backend_layers',
    keywords: ['backend', 'layer', 'ddd', 'clean architecture', 'controller', 'repository', 'clean code'],
    title: 'Enterprise Layered Backend Architecture (6-Layer DDD)',
    body: `Hafizi structures backends using Domain-Driven Design (DDD) principles and a strict 6-layer request lifecycle:\n\n` +
      `\`Route → Middleware → Controller → Service → Repository → Database / Cache\`\n\n` +
      `Each layer maintains a single, well-defined responsibility:\n\n` +
      `1. **Routes & Middleware:** Route URLs map cleanly to controllers, while middleware handles cross-cutting concerns—including CORS allowlisting, Helmet security headers, rate limiting, and JWT authentication.\n` +
      `2. **Controllers:** Parse incoming HTTP requests, validate request shapes, invoke domain services, and return normalized JSON responses with precise HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500).\n` +
      `3. **Services:** House 100% of pure business rules and domain logic (pricing validation, state machine transitions, bonus calculations). Services never touch raw SQL.\n` +
      `4. **Repositories:** The only layer permitted to interact with the database pool (\`pg.Pool\`), encapsulating all SQL queries using parameterized placeholders (\`$1, $2\`) to guarantee SQL injection immunity.\n` +
      `5. **Database & Cache:** PostgreSQL serves as the durable source of truth, accelerated by Redis cache-aside reads.`,
    relatedIds: ['postgres', 'redis', 'security', 'error_handling'],
    suggestPrompt: 'explore his 6-layer enterprise backend architecture',
  },
  {
    id: 'postgres',
    keywords: ['database', 'postgres', 'postgresql', 'supabase', 'sql', 'pool', 'dbeaver', 'migration'],
    title: 'PostgreSQL & Database Constraints (pg.Pool, Supabase, Docker)',
    body: `Hafizi treats the database as an active enforcement boundary for data integrity, rather than a passive storage bucket.\n\n` +
      `His relational database design emphasizes strict constraints and deterministic transactions:\n\n` +
      `1. **Relational Normalization:** Designed normalized schemas across users, categories, products, orders, inventory movements, and audit records with strict Primary and Foreign Keys.\n` +
      `2. **Database Constraints:** Uses database-level rules including \`NOT NULL\`, \`UNIQUE\`, and \`CHECK\` constraints (e.g. non-negative stock counts and positive product pricing) so invalid state can never be saved.\n` +
      `3. **Connection Pooling with \`pg.Pool\`:** Reuses a managed pool of database connections to handle concurrent traffic without exhausting server socket limits.\n` +
      `4. **Parameterized Queries:** Always utilizes parameterized queries (\`$1, $2\`) to guarantee absolute protection against SQL Injection vulnerabilities.\n` +
      `5. **Docker & Supabase Ecosystem:** Skilled in spinning up containerized PostgreSQL instances via Docker Compose, running database migrations, seeding test datasets, and managing live schemas via DBeaver.`,
    relatedIds: ['redis', 'backend_layers', 'urus_overview', 'security'],
    suggestPrompt: 'know how he structures PostgreSQL connection pooling and database integrity constraints',
  },
  {
    id: 'redis',
    keywords: ['redis', 'cache', 'caching', 'invalidation', 'ttl'],
    title: 'High-Throughput Redis Caching & Cache Invalidation Protocol',
    body: `Hafizi implements Redis as an in-memory acceleration layer governed by strict cache invalidation protocols:\n\n` +
      `1. **Cache-Aside Pattern:** On read requests, the service checks Redis first (\`products:all\`). On a cache hit, data is served in sub-milliseconds without touching PostgreSQL. On a cache miss, data is queried from PostgreSQL and cached with a Time-To-Live (TTL).\n` +
      `2. **Mandatory Invalidation on Write:** *"A cache without invalidation is a bug waiting for its first UPDATE."* Every mutation (POST, PUT, DELETE) immediately deletes the relevant Redis cache key (\`redisClient.del\`), forcing the next read to fetch fresh authoritative data.\n` +
      `3. **Source of Truth Discipline:** PostgreSQL is the permanent durable source of truth; Redis is treated as a disposable, rebuildable speed layer. If Redis ever restarts, the application continues to function seamlessly.`,
    relatedIds: ['postgres', 'backend_layers', 'urus_overview', 'error_handling'],
    suggestPrompt: 'see how he implements Redis cache invalidation on write',
  },
  {
    id: 'security',
    keywords: ['security', 'auth', 'jwt', 'bcrypt', 'rbac', 'helmet', 'cors'],
    title: 'Security, Authentication & Role-Based Authorization',
    body: `Hafizi builds defensive, hardened backends following the principle of least privilege and strict boundary validation:\n\n` +
      `1. **Irreversible Password Hashing (bcrypt):** Passwords are never stored in plain text or decrypted. They are hashed using **10 salt rounds** with bcrypt and verified using one-way comparisons.\n` +
      `2. **Stateless JWT Authentication:** Issues signed JSON Web Tokens containing user claims and expiration timestamps (\`expiresIn: '24h'\`). Verified via \`Authorization: Bearer <token>\` headers without database round-trips.\n` +
      `3. **Authentication vs. Authorization:** Clearly enforces the boundary:\n` +
      `   - **401 Unauthorized:** *"Who are you?"* (Missing, expired, or invalid token).\n` +
      `   - **403 Forbidden:** *"I know who you are, but you are not allowed to perform this action."* (Role check failed).\n` +
      `4. **Role-Based Access Control (RBAC):** Implemented multi-tier role guards (WORKER, HR, FINANCE, MANAGER, ADMIN) ensuring sensitive domains (payroll, financial records) are strictly siloed from operational workers.\n` +
      `5. **HTTP Hardening:** Layered with CORS domain allowlisting, Helmet security headers, Zod runtime validation, and API rate limiting.`,
    relatedIds: ['backend_layers', 'zod', 'postgres', 'takaful'],
    suggestPrompt: 'explore his RBAC authorization and stateless JWT security architecture',
  },

  // ==========================================
  // PILLAR 4: DEVELOPER TOOLS, VERIFICATION & AI
  // ==========================================
  {
    id: 'zod',
    keywords: ['zod', 'validation', 'runtime validation', 'schema validation', 'dto'],
    title: 'Zod Schema Validation & Runtime Type Contracts',
    body: `TypeScript guarantees type safety at compile time, but untrusted incoming API payloads or user form submissions can break runtime logic. Hafizi uses **Zod** to close this boundary:\n\n` +
      `1. **Fail-Fast Request Parsing:** All controller endpoints validate incoming \`req.body\`, \`req.params\`, and \`req.query\` against strict Zod schemas before touching service layers. Invalid payloads immediately return structured \`400 Bad Request\` errors.\n` +
      `2. **Inferred TypeScript Types:** Derives TypeScript interfaces directly from Zod schemas (\`z.infer<typeof Schema>\`), eliminating schema drift between validation logic and type declarations.\n` +
      `3. **Defensive Frontend Forms:** Pairs Zod schemas with React forms to provide instant, accessible client-side feedback while ensuring identical validation rules run on the server.`,
    relatedIds: ['typescript', 'react19', 'backend_layers', 'error_handling'],
    suggestPrompt: 'see how he enforces runtime type safety using Zod schema validation',
  },
  {
    id: 'postman',
    keywords: ['postman', 'swagger', 'openapi', 'api testing', 'endpoint verification', 'api contract'],
    title: 'API Testing & Contract Verification (Postman & OpenAPI/Swagger)',
    body: `Hafizi treats API contracts as binding architectural agreements between frontend clients and backend services:\n\n` +
      `1. **Postman Automated Testing:** Builds structured Postman collections with automated pre-request scripts and response assertions to test status codes (200, 201, 400, 401, 403, 404), schema payloads, and authentication headers.\n` +
      `2. **OpenAPI 3.0 / Swagger Documentation:** Authors standardized API specifications so that frontend engineers and AI coding assistants have unambiguous, interactive documentation for every route.\n` +
      `3. **Defensive Endpoint Verification:** Verifies edge cases—such as malformed JSON, SQL injection vectors, and unauthorized token manipulation—before any endpoint is considered ready for production.`,
    relatedIds: ['backend_layers', 'zod', 'git', 'error_handling'],
    suggestPrompt: 'explore his contract-first API testing with Postman and Swagger',
  },
  {
    id: 'git',
    keywords: ['git', 'github', 'pull request', 'pr', 'branching', 'merge conflict', 'git workflow', 'code review'],
    title: 'Git, GitHub & Collaborative Branching Discipline',
    body: `Hafizi maintains disciplined version control practices built for collaborative, enterprise-grade engineering teams:\n\n` +
      `1. **Feature Branching & Atomic Commits:** Follows structured feature branching (\`feature/\`, \`fix/\`, \`refactor/\`) paired with Conventional Commits to ensure clear, bisectable git histories.\n` +
      `2. **Conflict Resolution & Rebase Hygiene:** Proficient in resolving complex merge conflicts, interactive rebasing, and keeping feature branches synchronized with \`main\` without generating messy merge bubbles.\n` +
      `3. **Pull Requests & Code Defense:** Approaches PRs with clear architectural summaries, testing evidence, and defensive reviews—cultivated through his 42KL peer-defense training and KADA team agile sprints.`,
    relatedIds: ['prompt_ai', 'postman', 'backend_layers', 'why_hire'],
    suggestPrompt: 'know about his Git branching hygiene and code review defense practices',
  },
  {
    id: 'prompt_ai',
    keywords: ['prompt', 'antigravity', 'agent', 'vibe coding', 'sdlc', 'ai workflow', 'prompt engineering'],
    title: 'AI Prompt Engineering & Antigravity Workflows',
    body: `Hafizi practices **Responsible AI-Assisted Development** rather than unvetted "Vibe Coding":\n\n` +
      `In his workflow, human judgment steers architecture, data modeling, and security, while autonomous AI agents accelerate implementation under rigorous code review:\n\n` +
      `1. **The 5-Ingredient Prompt Specification:** Engineers prompts using the 5 essential pillars: **Role/Persona**, **Context**, **Task**, **Constraints** (libraries allowed/forbidden, naming conventions), and **Output Format**.\n` +
      `2. **Antigravity Autonomous Workflows:** Directs autonomous coding agent hierarchies in Google Antigravity, designing deterministic evaluation harnesses, and verifying code correctness through automated test suites.\n` +
      `3. **Zero-Trust AI Boundaries:** Assistive AI models are never given direct authority to approve financial transactions or overwrite critical state without human or deterministic verification.`,
    relatedIds: ['git', 'toph', 'urus_overview', 'kada'],
    suggestPrompt: 'explore his 5-ingredient prompt framework and Antigravity AI workflows',
  },
  {
    id: 'error_handling',
    keywords: ['error handling', 'resilience', 'status code', 'http status', 'apperror', 'exception'],
    title: 'Error Handling & System Resilience Architecture',
    body: `Hafizi designs backend services around defensive failure boundaries so errors are caught, normalized, and handled predictably:\n\n` +
      `1. **Centralized Error Middleware:** Express routes never return raw runtime exceptions or leaked database stack traces. A centralized error-handling middleware catches all rejected promises and formats them into a standardized JSON envelope (\`{ success: false, error: { message, code } }\`).\n` +
      `2. **Custom Typed Application Errors:** Uses custom error classes (\`AppError\`, \`NotFoundError\`, \`UnauthorizedError\`, \`ConflictError\`) with pre-mapped HTTP status codes (400, 401, 403, 404, 409, 500).\n` +
      `3. **Graceful Fallbacks:** External service failures (such as Redis connection drops or AI API timeouts) degrade gracefully—falling back to database reads or cached responses rather than taking down the server.`,
    relatedIds: ['backend_layers', 'zod', 'postgres', 'security'],
    suggestPrompt: 'see his centralized error-handling and resilience architecture',
  },

  // ==========================================
  // PILLAR 5: COPILOT, PLATFORM & PRODUCTION CAPABILITIES
  // ==========================================
  {
    id: 'toph',
    keywords: ['toph', 'who are you', 'what are you', 'your name', 'about toph', 'copilot'],
    title: 'About Toph — AI CV Copilot & Architecture',
    body: `I am **Toph**, Hafizi Ahmar’s official AI CV Copilot and technical advocate.\n\n` +
      `I was architected to give engineering leaders and recruiters direct, real-time insight into Hafizi’s system architecture, technical decisions, and background:\n\n` +
      `1. **Hybrid Edge Architecture:** I run on a two-tier hybrid engine—powered by a sub-second deterministic knowledge base for verified CV records, backed by Google Gemini 3.8 Flash for open-ended synthesis.\n` +
      `2. **Non-Authoritative & Grounded Design:** Built under strict closed-world grounding rules so I never hallucinate experience or expose private contact credentials without authorization.\n` +
      `3. **The Inspiration Behind the Name:** Named after *Toph Beifong* from Avatar—grounded, sharp, resilient, and sensing foundational structural truths directly through the code.`,
    relatedIds: ['portfolio_architecture', 'capabilities', 'why_hire', 'prompt_ai'],
    suggestPrompt: 'explore the tech stack and architecture of this interactive portfolio site itself',
  },
  {
    id: 'portfolio_architecture',
    keywords: ['portfolio', 'this website', 'this site', 'tech stack of this site', 'how was this built', 'architecture of this site', 'headless cms'],
    title: 'Interactive Portfolio & Headless CMS Architecture',
    body: `This interactive portfolio is a production-grade full-stack web application designed and built by Hafizi from scratch:\n\n` +
      `1. **Client-Side Architecture:** Built with modern **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, and **Vite**. Features custom Markdown rendering, reactive drawer state, and zero-layout-shift UI states.\n` +
      `2. **Cloud Backend & Database:** Powered by a layered **Node.js + Express** REST API deployed on Render, connected to containerized **PostgreSQL on Supabase** (Singapore region) and accelerated by an in-memory **Redis** cache-aside layer.\n` +
      `3. **Production Headless CMS:** Includes a secure, JWT-authenticated admin dashboard (\`/admin\`) allowing dynamic CRUD management over skills, experiences, and project records with instant database synchronization.\n` +
      `4. **Optimized Monorepo CI/CD:** Deployed via Netlify with custom build-credit suppression rules (\`netlify.toml\`) so frontend previews deploy in 20 seconds without burning serverless credits on backend commits.`,
    relatedIds: ['capabilities', 'react19', 'postgres', 'redis'],
    suggestPrompt: 'know what other production platforms Hafizi is capable of building',
  },
  {
    id: 'capabilities',
    keywords: ['can he build', 'able to build', 'capabilities', 'what can hafizi build', 'lms', 'workforce portal', 'landing page', 'saas', 'internal tools', 'build for our company'],
    title: 'Production Capabilities — What Systems Hafizi Can Build',
    body: `With his modern full-stack toolkit and systems discipline, Hafizi can architect and ship production software across several major enterprise domains:\n\n` +
      `1. **Enterprise SME & Workforce Portals:** Platforms like URUS featuring high-concurrency order dispatch queues, row-level database locking (\`FOR UPDATE SKIP LOCKED\`), camera barcode scanning, and transparent KPI ranking algorithms.\n` +
      `2. **Learning Management Systems (LMS) & Training Portals:** Structured course pipelines, real-time progress ledgers, automated e-certification generation (building on his Google Apps Script certification automation), and quiz evaluation engines.\n` +
      `3. **High-Performance SaaS & Corporate Web Applications:** Full-stack React 19 web apps backed by headless CMS architectures, multi-tenant databases, strict Zod input validation, and role-based access control (RBAC).\n` +
      `4. **AI-Enabled Operational Pipelines:** Embedding assistive AI copilots, OCR document ingestion, and autonomous agent workflows into legacy business operations with non-authoritative security boundaries.`,
    relatedIds: ['urus_overview', 'backend_layers', 'portfolio_architecture', 'why_hire'],
    suggestPrompt: 'explore his URUS capstone architecture and concurrency model',
  },
];

export class CopilotService {
  public lastDebugInfo: string = 'Initialized';

  async processQuery(question: string, history: ChatMessage[] = []): Promise<string> {
    const portfolio = await portfolioService.getFullPortfolioData();
    const qLower = question.toLowerCase().trim();

    // 0. Context-Aware Affirmation Router (e.g. "sure", "yes", "ok", "tell me more", "go ahead")
    const isAffirmative = /^(yes|sure|yeah|yep|ok|okay|yup|go ahead|tell me more|please|proceed|definitely|let's do it|of course|why not|yes please)[!.]*$/i.test(qLower);
    if (isAffirmative && history.length > 0) {
      const lastAssistantMsg = [...history].reverse().find((m) => m.role === 'assistant');
      if (lastAssistantMsg) {
        // Find which topic was suggested at the end of that message
        const suggestedTopic = TOPICS.find((t) =>
          lastAssistantMsg.content.includes(t.suggestPrompt)
        );
        if (suggestedTopic) {
          // Natural simulated thinking delay (1000ms)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const followUp = this.buildFollowUpPrompt(suggestedTopic, history, portfolio);
          this.lastDebugInfo = `Affirmation Router: Continued to ${suggestedTopic.id}`;
          return `${suggestedTopic.body}${followUp}`;
        }
      }
    }

    // 1. Instant High-Intelligence Prebuilt Topics (with natural 1000ms thinking delay)
    const instantKnowledge = this.matchPrebuiltTopic(qLower, portfolio, history);
    if (instantKnowledge) {
      // Natural simulated thinking delay (1000ms)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.lastDebugInfo = 'Instant Engine: Verified Technical Knowledge Base';
      return instantKnowledge;
    }

    // 2. Open-Ended Generative AI via Google AI Studio (Fast Grounded Fallback Concierge)
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

  private matchPrebuiltTopic(q: string, portfolio: any, history: ChatMessage[] = []): string | null {
    // Find matching topic based on keyword triggers
    const matched = TOPICS.find((topic) =>
      topic.keywords.some((k) => q.includes(k))
    );

    if (!matched) {
      return null;
    }

    // Append dynamic, statefully pruned follow-up suggestion
    const followUp = this.buildFollowUpPrompt(matched, history, portfolio);
    return `${matched.body}${followUp}`;
  }

  private buildFollowUpPrompt(topic: InternalTopic, history: ChatMessage[], portfolio: any): string {
    // Collect all topic IDs that have already been asked or answered in the conversation history
    const askedTopicIds = new Set<string>();
    askedTopicIds.add(topic.id); // Exclude the topic currently being answered

    for (const msg of history) {
      const textLower = msg.content.toLowerCase();
      for (const t of TOPICS) {
        if (t.keywords.some((k) => textLower.includes(k))) {
          askedTopicIds.add(t.id);
        }
      }
    }

    // Select candidate from related IDs first that hasn't been asked yet
    const unaskedRelated = topic.relatedIds.filter((id) => !askedTopicIds.has(id));
    let chosenId: string | null = null;

    if (unaskedRelated.length > 0) {
      chosenId = unaskedRelated[0];
    } else {
      // If all related topics were already asked, pick the first unasked topic from the master catalog
      const anyUnasked = TOPICS.map((t) => t.id).filter((id) => !askedTopicIds.has(id));
      if (anyUnasked.length > 0) {
        chosenId = anyUnasked[0];
      }
    }

    if (chosenId) {
      const target = TOPICS.find((t) => t.id === chosenId);
      if (target) {
        return `\n\nWould you like to ${target.suggestPrompt}?`;
      }
    }

    // If all 23 topics in the portfolio have already been explored
    const linkedin = portfolio.profile?.linkedin_url || 'https://www.linkedin.com/in/ahmad-hafizi-ahmar';
    return `\n\nYou have explored all key pillars of Hafizi's engineering profile! Feel free to ask any custom question or connect with him directly via the contact form or [LinkedIn](${linkedin}).`;
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
- Professional Experience: NVC Group (clinical operations & Google Apps Script automation), Puncak Niaga, Prudential, MAFI, MDEC.
- Education: KADA Fellow (Korea-ASEAN Digital Academy, organized with Garranto Academy — strictly never expand KADA as "Kita Anak Digital Academy" or any fictional name), 42KL Piscine (pure C systems programming), UiTM (Bachelor of Dietetics Hons).

[ZERO GREETING DIRECTIVE]
Never open with "Hello! I am Toph, Hafizi Ahmar's AI CV Copilot" or repetitive conversational pleasantries. Jump IMMEDIATELY into answering the question.

[MANDATORY OUTPUT STRUCTURE]
Every response you produce MUST strictly follow this exact 3-part layout:
Part 1: Conversational Opening (1-2 sentences directly answering the user's question and framing Hafizi's expertise).
Part 2: Two or three numbered highlights using bold concept titles:
   1. **[Core Concept Title]:** [Crisp, high-impact technical explanation]
   2. **[Core Concept Title]:** [Crisp, high-impact technical explanation]
Part 3: Closing Bridge Question (An engaging closing sentence steering the user toward one of his core portfolio areas: Career Journey, URUS, Full-Stack Architecture, or Tools & AI).

[STRICT GUARDRAILS & ANTI-HALLUCINATION]
- Strict Organization Naming: When referring to NVC, strictly and exclusively refer to it as "NVC Group" (never say "NVC Group Australia" or append "Australia" to its organization name).
- Closed-World Grounding: You must only answer questions based strictly on Hafizi's verified CV context. Never invent, fabricate, or extrapolate skills, companies, or credentials not explicitly present in his profile. If a user asks about technologies Hafizi has not worked with, state clearly that he specializes in his core stack (React 19, TypeScript, Node.js, PostgreSQL, Redis, Docker) and invite them to explore his verified work.
- Typography: Never output raw markdown headings (### or ##). Always use standard Markdown bold with double asterisks (**bold**). Never use single asterisks for bolding. Use backticks for code and technical identifiers.
- Privacy: Do not disclose raw personal phone numbers or private email addresses. Direct recruiters to the portfolio contact form or LinkedIn.
Provide a complete, articulate, and insightful answer directly without overthinking. Never leave thoughts cut off mid-sentence.`;

    try {
      const ai = new GoogleGenAI({ apiKey });

      let interaction: any;
      try {
        // Fast, speed-optimized execution: 750 tokens, temperature 0.15, low thinking depth
        interaction = await ai.interactions.create({
          model: 'models/gemini-3.8-flash',
          system_instruction: systemPrompt,
          input: question,
          generation_config: {
            max_output_tokens: 750,
            temperature: 0.15,
            thinking_level: 'low',
          },
        });
      } catch (innerErr: any) {
        // Fallback retry if system_instruction / thinking_level is rejected on older API endpoints
        logger.warn(`Interactions with system_instruction/thinking_level failed, retrying standard config: ${innerErr.message}`);
        interaction = await ai.interactions.create({
          model: 'models/gemini-3.8-flash',
          input: `${systemPrompt}\n\nUser Question: ${question}`,
          generation_config: {
            max_output_tokens: 750,
            temperature: 0.15,
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
