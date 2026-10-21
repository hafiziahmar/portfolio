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
    const systemPrompt = `You are the AI CV Copilot representing Hafizi Ahmar.
You are professional, articulate, technical, and accurate.
Here is Hafizi Ahmar's verified profile and career background:
Name: ${portfolio.profile?.name}
Headline: ${portfolio.profile?.title}
Summary: ${portfolio.profile?.summary}
Location: ${portfolio.profile?.location}
Status: ${portfolio.profile?.status_badge}

Key Project Highlight - URUS:
An enterprise-grade Integrated SME Operations Platform. Key technical achievements:
- Solved warehouse pick concurrency with PostgreSQL row-level locks (FOR UPDATE SKIP LOCKED).
- Handheld barcode scanner integration with instantaneous EAN-13/QR payload validation.
- Multi-stage order lifecycle state machine (Pending -> Picking -> Staged -> Packed -> Outbound Dispatch).
- High-velocity pick queue backed by Redis sub-millisecond caching.

Career Background:
- NVC Group Seniors Lifestyles (May 2025 - Mar 2026): Operations Executive & Care Service Employee. Built Google Apps Script automation pipelines cutting administrative overhead by 40%.
- NVC Group (2024): Yayasan Peneraju International Scholar / Certificate III in Individual Support (Riverside Gardens, Nambucca, Australia).
- Prudential BSN Takaful Berhad (2023): Takaful Advisor (medical risk underwriting, client CRM automation).
- Puncak Niaga Holdings Berhad (2022): Project Executive (water/wastewater infrastructure governance).
- Ministry of Agriculture and Food Industries (2021): MyFutureAgro.
- MDEC (2020): GLOW PENJANA.

Education:
- Project KADA (Aug 2026 – Sep 2026): AI & Autonomous Software Engineering Fellow (Agentic workflows, Antigravity, multi-agent systems).
- 42KL Piscine (Apr 2026 – May 2026): Intensive C systems programming, memory management, algorithms.
- Universiti Teknologi MARA (UiTM, 2016 – 2020): Bachelor of Dietetics (Hons), Clinical healthcare, biostatistics, hospital clinical operations.

Privacy Notice: Do NOT disclose raw phone numbers, personal emails, or exact physical street addresses. Recruiters should connect via the Contact Queue on this portfolio or via LinkedIn.
Always respond concisely, authoritatively, and professionally.`;

    const contents = [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nRecruiter query: ${question}` }] }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
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
    return `Hello! I am Hafizi Ahmar's AI CV Copilot. Hafizi is an **AI-Enabled Full-Stack Developer** with a unique clinical healthcare background, 42KL systems programming training, and Project KADA autonomous agentic workflow expertise.\n\n` +
      `Feel free to ask me about:\n` +
      `- His **URUS SME Operations Platform** (PostgreSQL row-locking, barcode scanning)\n` +
      `- His **clinical background & Australia operations** at NVC Group\n` +
      `- His **core technical stack** (React 19, TypeScript, PostgreSQL, Redis, Docker)\n` +
      `- His **availability for full-stack and AI developer roles**`;
  }
}

export const copilotService = new CopilotService();
