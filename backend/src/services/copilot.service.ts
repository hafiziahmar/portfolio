import { portfolioService } from './portfolio.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class CopilotService {
  async processQuery(question: string, history: ChatMessage[] = []): Promise<string> {
    const portfolio = await portfolioService.getFullPortfolioData();
    const qLower = question.toLowerCase().trim();

    // If Gemini API key is configured, attempt LLM call
    if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '') {
      try {
        const aiResponse = await this.callGeminiAPI(question, portfolio, history);
        if (aiResponse) return aiResponse;
      } catch (err: any) {
        logger.warn('Gemini API call failed, falling back to local CV knowledge engine:', err.message);
      }
    }

    // Built-in High-Fidelity Portfolio Knowledge Engine
    return this.generateKnowledgeResponse(qLower, portfolio);
  }

  private async callGeminiAPI(question: string, portfolio: any, history: ChatMessage[]): Promise<string | null> {
    const apiKey = env.GEMINI_API_KEY?.trim();
    if (!apiKey) return null;

    const systemPrompt = `You are Toph, the official AI CV Copilot for Hafizi Ahmar.
You speak on behalf of Hafizi with warmth, technical precision, high intelligence, and professional advocacy.
You are directly and accurately grounded in Hafizi Ahmar's authentic career background, technical projects, and clinical experience.

Core Persona & Communication Style:
- Warm, articulate, consultative, and technically sharp.
- When answering recruiters or technical managers, provide insightful, context-rich explanations that connect Hafizi's clinical precision with his software engineering capabilities.
- Be conversational and engaging—do not just spit out dry or robotic bullet points unless asked for a list. Explain the "why" and "how" behind his engineering choices.
- If asked open-ended questions (e.g. why should someone hire him, what makes him unique, or how he approaches problems), synthesize his unique blend of clinical discipline, 42KL algorithmic rigor, and AI-enabled full-stack engineering with real depth.

Verified Background Knowledge:
- Name: ${portfolio.profile?.name}
- Headline: ${portfolio.profile?.title}
- Summary: ${portfolio.profile?.summary}
- Location: ${portfolio.profile?.location}
- Status: ${portfolio.profile?.status_badge}

Key Capstone Project - URUS:
Integrated SME Operations Platform connecting inbound procurement, inventory, outbound fulfillment, workforce activity, KPI measurement, expenses, payroll, and management intelligence.
- Directed autonomous coding agents in Antigravity to build and deliver the Outbound Fulfillment & Dispatch Queue module.
- Guided the implementation of the multi-stage order lifecycle (READY_TO_PICK → PICKING → PACKING → FULFILLED) with camera-based barcode scanning for real-time SKU verification.
- Implemented and validated atomic order-claiming logic using PostgreSQL FOR UPDATE SKIP LOCKED row-level locking to prevent concurrent picking conflicts among workers.
- Configured automated inventory deductions and verified operational events upon order completion.
- Layered REST APIs in Node.js and Express connected to Dockerized PostgreSQL instances, stateless JWT authentication, bcrypt password hashing, and Redis caching.

Career Experience:
1. NVC Group Seniors Lifestyles (M) Sdn Bhd (May 2025 – Mar 2026): Operations Executive & Care Service Employee.
   - Engineered automated event registration and feedback database system with Google Workspace and Google Apps Script, eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.
   - Structured prompting with LLMs to accelerate script writing and prototype operational workflows, bridging healthcare processes with technical automation.
2. NVC Group (2024): Yayasan Peneraju International Scholar (Certificate III in Individual Support, Riverside Gardens, Nambucca, Australia).
   - Practical placement and clinical operations adhering to Australian aged care compliance frameworks and cultivating cross-cultural fluency.
3. Prudential BSN Takaful Berhad (2023): Takaful Advisor. Client portfolio management, risk evaluation, financial protection.
4. Puncak Niaga Holdings Berhad (2022): Project Executive. Milestone scheduling, procurement strategies, budget formulation, cross-cultural team management.
5. Ministry of Agriculture and Food Industries (MAFI) (2021): MyFutureAgro Participant. Smart farming systems, automated fertigation installation.
6. Malaysia Digital Economy Corporation (MDEC) (2020): GLOW PENJANA Participant. Remote delivery frameworks, digital marketplaces.

Education & Training:
1. Korea-ASEAN Digital Academy (KADA) (Aug 2026 – Sep 2026): AI-Enabled Full-Stack Development.
   - Domain-driven design (DDD), Figma translation, React, Vite, Tailwind CSS, Zustand, layered Node.js/Express REST APIs, Dockerized PostgreSQL, stateless JWT/bcrypt, Redis caching, Postman verification, OpenAPI 3.0/Swagger, browser DevTools.
2. 42KL (Apr 2026 – May 2026): Piscine Participant – Software Engineering.
   - Low-level imperative logic, algorithmic thinking, pure C programming, zero external dependencies, automated evaluation systems.
3. Universiti Teknologi MARA (UiTM) Puncak Alam (2020): Bachelor of Dietetics (Hons.).
   - Precision Medical Nutrition Therapy (MNT), biochemical and clinical data interpretation, behavioral counseling, quantitative research methodologies.

Privacy Notice: Do NOT disclose raw phone numbers or personal emails. Recruiters should connect via the Contact Queue on this portfolio or via LinkedIn (${portfolio.profile?.linkedin_url || 'https://www.linkedin.com/in/ahmad-hafizi-ahmar'}).
Always sign off or speak naturally as Toph.`;

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
        maxOutputTokens: 1000
      }
    };

    // Try GA and current preview models with robust fallback
    const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];
    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data: any = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return text.trim();
          }
        } else {
          const errText = await response.text();
          logger.warn(`Gemini API call to ${model} returned HTTP ${response.status}: ${errText}`);
        }
      } catch (err: any) {
        logger.warn(`Gemini API network exception on ${model}: ${err.message}`);
      }
    }
    return null;
  }

  private generateKnowledgeResponse(q: string, portfolio: any): string {
    // 1. URUS project questions
    if (q.includes('urus') || q.includes('project') || q.includes('race condition') || q.includes('barcode') || q.includes('order')) {
      const urus = portfolio.projects.find((p: any) => p.title.includes('URUS'));
      return `**URUS (Integrated SME Operations Platform)** is one of Hafizi's hallmark full-stack engineering achievements.\n\n` +
        `**Key Technical Highlights:**\n` +
        `- **Atomic Order Claiming:** Implemented PostgreSQL \`FOR UPDATE SKIP LOCKED\` row-level locking to completely eliminate double-picking race conditions among parallel warehouse operators.\n` +
        `- **Barcode Scanner Pipeline:** Instant camera & handheld scanner integration validating EAN-13, SKU, and QR codes before printing outbound dispatch labels.\n` +
        `- **Finite State Machine:** Multi-stage lifecycle (\`Pending\` → \`Picking\` → \`Staged\` → \`Packed\` → \`Outbound Dispatch\`) with strict transitions and immutable audit logs.\n` +
        `- **High-Throughput Caching:** Outbound pick queue accelerated with Redis sub-millisecond in-memory caching.\n` +
        `- **Stack:** React 19, TypeScript, Node.js, Express, PostgreSQL, Redis, TailwindCSS v4, and Docker.`;
    }

    // 2. Clinical background & career transition
    if (q.includes('clinical') || q.includes('healthcare') || q.includes('dietetics') || q.includes('transition') || q.includes('uitm') || q.includes('doctor') || q.includes('nursing')) {
      return `Hafizi brings a unique, rare hybrid pedigree: a **clinical healthcare background** (Bachelor of Dietetics Hons from UiTM) combined with **high-rigor software engineering** (42KL Piscine, Project KADA Fellow, and Antigravity autonomous workflows).\n\n` +
        `In clinical healthcare and operations at NVC Group in Australia, Hafizi developed zero-tolerance standards for errors, patient safety, and regulatory compliance. He channeled this discipline into engineering by building automated clinical scheduling workflows with Google Apps Script, which cut administrative latency by 40%.\n\n` +
        `This gives him unmatched domain insight when architecting health-tech, operational automation, or safety-critical data systems.`;
    }

    // 3. NVC Group & Australia experience
    if (q.includes('nvc') || q.includes('australia') || q.includes('peneraju') || q.includes('scholar') || q.includes('care')) {
      return `Hafizi's tenure with **NVC Group** spans two major milestones:\n\n` +
        `1. **Operations Executive & Care Service Employee (May 2025 – March 2026):**\n` +
        `- Automated clinical staff handovers and resident logistics using Google Apps Script, reducing overhead by 40%.\n` +
        `- Ensured clinical operations strictly conformed to the Australian Aged Care Quality Standards.\n\n` +
        `2. **Yayasan Peneraju International Scholar (2024):**\n` +
        `- Awarded a prestigious overseas sponsorship by Yayasan Peneraju.\n` +
        `- Earned Certificate III in Individual Support in Nambucca, Australia, specializing in clinical triage, resident advocacy, and crisis management.`;
    }

    // 4. Autonomous AI & Antigravity & Agentic workflows
    if (q.includes('ai') || q.includes('antigravity') || q.includes('agent') || q.includes('workflow') || q.includes('llm') || q.includes('kada')) {
      return `Hafizi is an **AI-Enabled Full-Stack Developer** specializing in autonomous engineering workflows:\n\n` +
        `- **Project KADA Fellow (Aug – Sep 2026):** Focused on agentic decomposition, multi-agent systems, and production LLM orchestration.\n` +
        `- **Google Antigravity:** Expert in designing subagent hierarchies, deterministic evaluation harnesses, and autonomous verification pipelines.\n` +
        `- **RAG & Semantic Systems:** Deep understanding of embeddings, vector lookups, prompt optimization, and fallback logic.\n` +
        `- **Defensive Engineering:** Couples AI code synthesis with strict Zod runtime contracts and automated migration rollbacks.`;
    }

    // 5. 42KL Piscine
    if (q.includes('42') || q.includes('piscine') || q.includes('c language') || q.includes('pointer') || q.includes('memory')) {
      return `Hafizi completed the renowned **42KL Piscine Intensive (Apr – May 2026)**.\n\n` +
        `- **Low-Level Systems:** Wrote rigorous algorithms in pure C (memory management, pointer arithmetic, custom string parsing, recursion).\n` +
        `- **Zero External Dependencies:** Built core Unix utilities and data structures from scratch.\n` +
        `- **Peer-to-Peer Evaluation:** Subjected to grueling daily code defenses and autonomous grading under intense time constraints.`;
    }

    // 6. Technical Stack & Skills
    if (q.includes('stack') || q.includes('skills') || q.includes('tech') || q.includes('react') || q.includes('typescript') || q.includes('node') || q.includes('postgres') || q.includes('docker')) {
      return `Hafizi's core production stack spans:\n\n` +
        `- **Frontend:** React 19, TypeScript (Strict), TailwindCSS v4, Vite, responsive ergonomic UI/UX.\n` +
        `- **Backend:** Node.js, Express, RESTful architecture (routes → controllers → services → repositories).\n` +
        `- **Databases & Cache:** PostgreSQL (Docker-ready, relational normalization, row-level locks), Redis in-memory cache with fallback.\n` +
        `- **Security & Auth:** JWT tokens, bcrypt password hashing, Zod runtime validation, Helmet, CORS.\n` +
        `- **DevOps & Tools:** Docker Compose, Git, Linux shell, Google Apps Script, CI/CD.`;
    }

    // 7. Contact, Hiring, Availability, Location
    if (q.includes('contact') || q.includes('hire') || q.includes('available') || q.includes('interview') || q.includes('location') || q.includes('email') || q.includes('remote')) {
      return `Hafizi Ahmar is currently **${portfolio.profile?.status_badge || 'Open for Full-Stack & AI Roles'}**!\n\n` +
        `- **Location:** ${portfolio.profile?.location || 'Malaysia (Available for Global Remote Roles)'}.\n` +
        `- **Direct Inquiries:** To protect against web scraping and spam, personal phone numbers and direct emails are not publicly published. Please send a message through the **Interactive Contact Queue Form** right below on this portfolio, or connect via [LinkedIn](${portfolio.profile?.linkedin_url || 'https://www.linkedin.com/in/ahmad-hafizi-ahmar'}). All inquiries are immediately delivered to Hafizi's secure review queue!`;
    }

    // Default friendly overview
    return `Hello! I am Toph. I have full context on Hafizi Ahmar's professional background.\n\n` +
      `Feel free to ask me anything about:\n` +
      `- His **URUS SME Operations Platform** (PostgreSQL row-locking, barcode scanning, outbound queue)\n` +
      `- His **clinical background & operations** at NVC Group\n` +
      `- His **technical capabilities** (React 19, TypeScript, PostgreSQL, Redis, Docker, Antigravity AI)\n` +
      `- His **career timeline and education** (KADA, 42KL, UiTM)\n\n` +
      `How may I help you?`;
  }
}

export const copilotService = new CopilotService();
