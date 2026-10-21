import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { hashPassword } from '../utils/hash.js';
import { logger } from '../utils/logger.js';
import { runMigrations } from './migrate.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Ensuring database tables exist...');
    await runMigrations();

    logger.info('Seeding database with authentic CV records for Ahmad Hafizi Bin Ahmar...');

    // 1. Seed Profile (word-for-word from official CV)
    await pool.query('DELETE FROM profile');
    await pool.query(
      `INSERT INTO profile (name, title, summary, linkedin_url, github_url, location, status_badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'Ahmad Hafizi Bin Ahmar',
        'AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise (Dietetics Hons.)',
        'AI-Enabled Full-Stack Developer with a foundation in clinical healthcare and enterprise operations. Skilled at directing autonomous AI agent platforms to rapidly build, test, and ship production-ready web applications. Combines algorithmic thinking from 42KL Piscine with modern full-stack training from Project KADA to translate operational bottlenecks into clean user interfaces, dependable APIs, and structured database systems.',
        'https://www.linkedin.com/in/ahmad-hafizi-ahmar',
        'https://github.com/hafiziahmar',
        'Telok Panglima Garang, Selangor, Malaysia',
        'Open for Full-Stack & AI Roles',
      ]
    );

    // 2. Seed Skills (word-for-word from CV Technical Skill Inventory)
    await pool.query('DELETE FROM skills');
    const skills = [
      // Autonomous AI Development & Workspaces
      { cat: 'Autonomous AI Development & Workspaces', name: 'Antigravity AI Agent Platform', level: 5, highlight: true, idx: 1 },
      { cat: 'Autonomous AI Development & Workspaces', name: 'Agentic Workflows', level: 5, highlight: true, idx: 2 },
      { cat: 'Autonomous AI Development & Workspaces', name: 'Structured Prompt Engineering (Role-Context-Task-Constraint)', level: 5, highlight: true, idx: 3 },
      { cat: 'Autonomous AI Development & Workspaces', name: 'Iterative AI Debugging', level: 5, highlight: false, idx: 4 },
      { cat: 'Autonomous AI Development & Workspaces', name: 'Non-Authoritative AI System Boundaries', level: 5, highlight: false, idx: 5 },

      // Full-Stack Technologies (Generated & Steered via AI)
      { cat: 'Full-Stack Technologies', name: 'React 19', level: 5, highlight: true, idx: 6 },
      { cat: 'Full-Stack Technologies', name: 'TypeScript', level: 5, highlight: true, idx: 7 },
      { cat: 'Full-Stack Technologies', name: 'JavaScript', level: 5, highlight: false, idx: 8 },
      { cat: 'Full-Stack Technologies', name: 'TailwindCSS v4', level: 5, highlight: false, idx: 9 },
      { cat: 'Full-Stack Technologies', name: 'Vite', level: 5, highlight: false, idx: 10 },
      { cat: 'Full-Stack Technologies', name: 'NestJS', level: 5, highlight: false, idx: 11 },
      { cat: 'Full-Stack Technologies', name: 'Node.js / Express', level: 5, highlight: true, idx: 12 },
      { cat: 'Full-Stack Technologies', name: 'PostgreSQL 18 (Supabase / Docker)', level: 5, highlight: true, idx: 13 },
      { cat: 'Full-Stack Technologies', name: 'Zod Validation', level: 5, highlight: false, idx: 14 },
      { cat: 'Full-Stack Technologies', name: 'OpenAPI 3.0 / Swagger', level: 5, highlight: false, idx: 15 },

      // Hands-On Verification, Data & Developer Tools
      { cat: 'Hands-On Verification & Tools', name: 'Postman (API Endpoint Verification)', level: 5, highlight: true, idx: 16 },
      { cat: 'Hands-On Verification & Tools', name: 'Browser DevTools (Network & State Inspection)', level: 5, highlight: true, idx: 17 },
      { cat: 'Hands-On Verification & Tools', name: 'DBeaver (Database GUI)', level: 4, highlight: false, idx: 18 },
      { cat: 'Hands-On Verification & Tools', name: 'Git & GitHub (Branching, PRs, Merge Conflicts)', level: 5, highlight: true, idx: 19 },
      { cat: 'Hands-On Verification & Tools', name: 'Docker Desktop', level: 4, highlight: false, idx: 20 },
      { cat: 'Hands-On Verification & Tools', name: 'Google Apps Script', level: 5, highlight: true, idx: 21 },

      // System Design & Domain Workflows
      { cat: 'System Design & Workflows', name: 'Multi-Stage Order Lifecycles (READY_TO_PICK to FULFILLED)', level: 5, highlight: true, idx: 22 },
      { cat: 'System Design & Workflows', name: 'Camera Barcode SKU Verification', level: 5, highlight: true, idx: 23 },
      { cat: 'System Design & Workflows', name: 'Atomic Order-Claiming Logic', level: 5, highlight: true, idx: 24 },
      { cat: 'System Design & Workflows', name: 'Data-Driven UI States (Loading, Error, Empty, Success)', level: 5, highlight: false, idx: 25 },
      { cat: 'System Design & Workflows', name: 'Role-Based Access Control (RBAC)', level: 5, highlight: false, idx: 26 },
    ];

    for (const s of skills) {
      await pool.query(
        `INSERT INTO skills (category, name, proficiency_level, highlight, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [s.cat, s.name, s.level, s.highlight, s.idx]
      );
    }

    // 3. Seed Experiences (word-for-word from CV with exact dates)
    await pool.query('DELETE FROM experiences');
    const experiences = [
      {
        company: 'NVC Group Seniors Lifestyles (M) Sdn Bhd',
        role: 'Operations Executive & Care Service Employee',
        location: 'Malaysia / Australia',
        start_date: 'May 2025',
        end_date: 'Mar 2026',
        is_current: false,
        description: 'Spearheaded administration, procurement, compliance, and digital outreach pipelines for an Australian aged-care organization expanding operations into the Malaysian market.',
        achievements: [
          'Engineered and deployed an automated event registration and database feedback system utilizing Google Workspace and Google Apps Script, eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.',
          'Leveraged structured prompting techniques with LLM assistants to accelerate script writing and prototype operational workflows, bridging healthcare processes with technical automation.',
        ],
        technologies: ['Google Apps Script', 'Google Workspace', 'Process Automation', 'Healthcare Operations', 'LLM Prompting'],
        order_index: 1,
      },
      {
        company: 'NVC Group',
        role: 'Yayasan Peneraju International Scholar (Certificate III in Individual Support)',
        location: 'Riverside Gardens, Nambucca, Australia',
        start_date: '2024',
        end_date: '2024',
        is_current: false,
        description: 'Selected for a competitive global talent scholarship to undergo intensive on-site care operations and compliance training within NV College, alongside a practical placement within NVC Group’s Riverside Gardens Aged Care Facility in New South Wales, Australia.',
        achievements: [
          'Mastered strict international healthcare compliance frameworks and adapted operational protocols to global standards while cultivating cross-cultural fluencies.',
        ],
        technologies: ['Healthcare Compliance', 'Clinical Operations', 'Cross-Cultural Fluency'],
        order_index: 2,
      },
      {
        company: 'Prudential BSN Takaful Berhad',
        role: 'Takaful Advisor',
        location: 'Malaysia',
        start_date: '2023',
        end_date: '2023',
        is_current: false,
        description: 'Managed client portfolios, performed risk evaluations, and translated complex financial protection structures into clear, accessible solutions for clients.',
        achievements: [
          'Utilized internal enterprise digital platforms and CRM software to streamline application submissions and manage data pipelines.',
          'Maintained strict compliance with financial regulations and industry standards across all client accounts.',
        ],
        technologies: ['Enterprise CRM', 'Risk Evaluation', 'Portfolio Management', 'Financial Compliance'],
        order_index: 3,
      },
      {
        company: 'Puncak Niaga Holdings Berhad',
        role: 'Project Executive',
        location: 'Malaysia',
        start_date: '2022',
        end_date: '2022',
        is_current: false,
        description: 'Orchestrated end-to-end project planning, milestone scheduling, and execution for landscaping projects at Masjid Puncak Alam and Ma’ahad Tahfiz Ismail.',
        achievements: [
          'Formulated project budgets, executed procurement strategies, managed assets and inventories, and acted as the primary liaison for supplier and contractor negotiations.',
          'Led and supervised a cross-cultural team of 10+ operational workers to optimize daily workflows, reporting project velocity directly to the Director.',
        ],
        technologies: ['Project Planning', 'Budget Formulation', 'Procurement & Inventory', 'Team Leadership'],
        order_index: 4,
      },
      {
        company: 'Ministry of Agriculture and Food Industries (MAFI)',
        role: 'MyFutureAgro Program Participant',
        location: 'Malaysia',
        start_date: '2021',
        end_date: '2021',
        is_current: false,
        description: 'Selected for a competitive agricultural technology initiative focused on deploying modern smart farming infrastructures.',
        achievements: [
          'Co-engineered and built a commercial one-acre chili cultivation facility from the ground up, directly installing and configuring automated fertigation delivery systems.',
        ],
        technologies: ['Smart Farming Systems', 'Automated Fertigation', 'Facility Engineering'],
        order_index: 5,
      },
      {
        company: 'Malaysia Digital Economy Corporation (MDEC)',
        role: 'Global Online Workforce (GLOW PENJANA) Participant',
        location: 'Malaysia',
        start_date: '2020',
        end_date: '2020',
        is_current: false,
        description: 'Immersed in specialized training focused on exploring freelance tech ecosystems, digital marketplace onboarding, and remote delivery frameworks.',
        achievements: [
          'Formulated professional client outreach pipelines, digital portfolio presentation standards, and cross-border service delivery strategies.',
          'Equipped with structured remote project execution workflows, digital asset management, and independent professional branding strategies.',
        ],
        technologies: ['Remote Delivery Frameworks', 'Digital Marketplaces', 'Outreach Pipelines'],
        order_index: 6,
      },
    ];

    for (const exp of experiences) {
      await pool.query(
        `INSERT INTO experiences (company, role, location, start_date, end_date, is_current, description, achievements, technologies, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          exp.company,
          exp.role,
          exp.location,
          exp.start_date,
          exp.end_date,
          exp.is_current,
          exp.description,
          exp.achievements,
          exp.technologies,
          exp.order_index,
        ]
      );
    }

    // 4. Seed Capstone Project: URUS only (word-for-word from CV)
    await pool.query('DELETE FROM projects');
    const projects = [
      {
        title: 'URUS — Integrated SME Operations Platform',
        tagline: 'Outbound fulfillment queue, multi-stage order lifecycles, barcode scanning, atomic order claiming (5-Member Agile Team)',
        description: 'Integrated operational platform for stock-based small and medium enterprises (SMEs) connecting inbound procurement, inventory, outbound fulfillment, workforce activity, KPI measurement, expenses, payroll, and management intelligence within one canonical pipeline.',
        architecture_details: 'Directed autonomous coding agents in Antigravity to build and deliver the Outbound Fulfillment & Dispatch Queue module. Constructed layered REST APIs in Node.js and Express connected to Dockerized PostgreSQL instances using connection pools (pg) and parameterization against SQL injection. Implemented stateless JWT authentication, bcrypt password hashing, and Redis caching with explicit cache-invalidation on database writes.',
        key_features: [
          'Directed autonomous coding agents in Antigravity to build and deliver the Outbound Fulfillment & Dispatch Queue module for an SME operations platform.',
          'Guided the AI implementation of the multi-stage order lifecycle (READY_TO_PICK → PICKING → PACKING → FULFILLED), integrating camera-based barcode scanning for real-time SKU verification.',
          'Prompted and validated order-claiming logic designed to prevent concurrent picking conflicts, ensuring orders could only be claimed by one worker at a time.',
          'Configured end-to-end fulfillment workflows that trigger automatic inventory deductions and emit verified operational events upon order completion.',
          'Verified module data flows against team schemas and API endpoints to ensure outbound completion correctly fed into downstream workforce KPI metrics.',
        ],
        tech_stack: ['React 19', 'TypeScript', 'TailwindCSS v4', 'Vite', 'Node.js / Express', 'PostgreSQL', 'Docker', 'Zod Validation'],
        github_url: '',
        demo_url: '',
        featured: true,
        order_index: 1,
      },
    ];

    for (const p of projects) {
      await pool.query(
        `INSERT INTO projects (title, tagline, description, architecture_details, key_features, tech_stack, github_url, demo_url, featured, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          p.title,
          p.tagline,
          p.description,
          p.architecture_details,
          p.key_features,
          p.tech_stack,
          p.github_url,
          p.demo_url,
          p.featured,
          p.order_index,
        ]
      );
    }

    // 5. Seed Education & Specialized Training (word-for-word from CV)
    await pool.query('DELETE FROM education');
    const education = [
      {
        institution: 'Korea-ASEAN Digital Academy (KADA)',
        degree: 'Project KADA Participant – AI-Enabled Full-Stack Development',
        period: 'Aug 2026 – Sep 2026',
        field_of_study: 'Full-Stack Engineering & System Architecture Foundations',
        description: 'Completed comprehensive engineering training spanning domain-driven design (DDD), wireframing/Figma translation, and component-driven frontend architecture using React, Vite, Tailwind CSS, and Zustand. Directed AI workflows to construct layered REST APIs in Node.js and Express connected to Dockerized PostgreSQL instances. Implemented stateless JWT authentication, bcrypt password hashing, and Redis caching. Verified system endpoints using Postman test collections, OpenAPI 3.0/Swagger, and browser DevTools.',
        badges: ['Domain-Driven Design', 'Layered Architecture', 'JWT & Bcrypt', 'Redis Caching', 'PostgreSQL'],
        order_index: 1,
      },
      {
        institution: '42KL',
        degree: 'Piscine Participant – Software Engineering',
        period: 'Apr 2026 – May 2026',
        field_of_study: 'Low-Level Logic, Imperative Logic & C Programming',
        description: 'Completed the intensive, teacherless, peer-to-peer 4-week programming pool focused on low-level logic, algorithmic thinking, and imperative logic structure using C. Developed high cognitive agility and resilience by resolving complex computing challenges under rigorous automated evaluation systems.',
        badges: ['C Programming', 'Algorithms', 'Imperative Logic', 'Automated Evaluation'],
        order_index: 2,
      },
      {
        institution: 'Universiti Teknologi MARA (UiTM) Puncak Alam',
        degree: 'Bachelor of Dietetics (Hons.)',
        period: '2020',
        field_of_study: 'Clinical Healthcare, Biochemical Nutrition & Data Analysis',
        description: 'Formulated precision Medical Nutrition Therapy (MNT) by interpreting raw biochemical parameters and clinical data inputs. Utilized behavioral counseling frameworks to systematically deliver and execute clinical dietary interventions. Executed structured quantitative research methodologies to accurately track, analyze, and report on complex data trends.',
        badges: ['Medical Nutrition Therapy', 'Clinical Data Interpretation', 'Quantitative Research'],
        order_index: 3,
      },
    ];

    for (const edu of education) {
      await pool.query(
        `INSERT INTO education (institution, degree, period, field_of_study, description, badges, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [edu.institution, edu.degree, edu.period, edu.field_of_study, edu.description, edu.badges, edu.order_index]
      );
    }

    // 6. Seed Admin
    await pool.query('DELETE FROM admins');
    const hashedPassword = await hashPassword(env.ADMIN_INITIAL_PASSWORD);
    await pool.query(
      `INSERT INTO admins (username, email, password_hash)
       VALUES ($1, $2, $3)`,
      [env.ADMIN_INITIAL_USERNAME, env.ADMIN_INITIAL_EMAIL, hashedPassword]
    );

    logger.info('Database seeded successfully with authentic CV records.');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
};

// Allow direct execution
if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Seeding process failed:', err);
      process.exit(1);
    });
}
