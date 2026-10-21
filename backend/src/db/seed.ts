import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { hashPassword } from '../utils/hash.js';
import { logger } from '../utils/logger.js';
import { runMigrations } from './migrate.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Ensuring database tables exist...');
    await runMigrations();

    logger.info('Seeding database with Hafizi Ahmar portfolio records...');

    // 1. Seed Profile
    await pool.query('DELETE FROM profile');
    await pool.query(
      `INSERT INTO profile (name, title, summary, linkedin_url, github_url, location, status_badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'Hafizi Ahmar',
        'AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise',
        'Clinical-domain technologist turned AI-enabled full-stack engineer. Combines rigorous healthcare operations discipline with modern web engineering, 42KL systems programming immersion, and Antigravity autonomous agentic workflows. Proven track record in streamlining mission-critical workflows, building resilient database architectures, and deploying high-throughput operational platforms like URUS with zero tolerance for state inconsistencies.',
        'https://www.linkedin.com/in/hafizi-ahmar/',
        'https://github.com/hafizi-ahmar',
        'Malaysia (Available for Global Remote Roles)',
        'Open for Full-Stack & AI Roles',
      ]
    );

    // 2. Seed Skills
    await pool.query('DELETE FROM skills');
    const skills = [
      // Autonomous AI Development
      { cat: 'Autonomous AI Development', name: 'Antigravity & Agentic Workflows', level: 5, highlight: true, idx: 1 },
      { cat: 'Autonomous AI Development', name: 'LLM Prompt Engineering & Reasoning Chains', level: 5, highlight: true, idx: 2 },
      { cat: 'Autonomous AI Development', name: 'RAG & Semantic Retrieval Systems', level: 4, highlight: false, idx: 3 },
      { cat: 'Autonomous AI Development', name: 'Multi-Agent Orchestration & Subagent Delegation', level: 5, highlight: true, idx: 4 },
      { cat: 'Autonomous AI Development', name: 'Autonomous Testing & Code Synthesis', level: 5, highlight: false, idx: 5 },

      // Full-Stack Technologies
      { cat: 'Full-Stack Technologies', name: 'React 19 & Modern Web Standards', level: 5, highlight: true, idx: 6 },
      { cat: 'Full-Stack Technologies', name: 'TypeScript (Strict Mode)', level: 5, highlight: true, idx: 7 },
      { cat: 'Full-Stack Technologies', name: 'Node.js & Express Architecture', level: 5, highlight: true, idx: 8 },
      { cat: 'Full-Stack Technologies', name: 'PostgreSQL Relational Modeling & Indexing', level: 5, highlight: true, idx: 9 },
      { cat: 'Full-Stack Technologies', name: 'Redis Caching & In-Memory State', level: 4, highlight: false, idx: 10 },
      { cat: 'Full-Stack Technologies', name: 'TailwindCSS v4 & Ergonomic UI Systems', level: 5, highlight: false, idx: 11 },
      { cat: 'Full-Stack Technologies', name: 'RESTful API Engineering & Rate Limiting', level: 5, highlight: false, idx: 12 },

      // Tools & Verification
      { cat: 'Tools & Verification', name: 'Docker Containerization & Compose', level: 4, highlight: true, idx: 13 },
      { cat: 'Tools & Verification', name: 'Git & Trunk-Based Deployment', level: 5, highlight: true, idx: 14 },
      { cat: 'Tools & Verification', name: 'Google Apps Script Workflow Automation', level: 5, highlight: true, idx: 15 },
      { cat: 'Tools & Verification', name: 'Zod Defensive Schema Validation', level: 5, highlight: false, idx: 16 },
      { cat: 'Tools & Verification', name: 'Linux Bash & DevOps Scripting', level: 4, highlight: false, idx: 17 },
      { cat: 'Tools & Verification', name: 'JWT & Bcrypt Security Engineering', level: 5, highlight: false, idx: 18 },
    ];

    for (const s of skills) {
      await pool.query(
        `INSERT INTO skills (category, name, proficiency_level, highlight, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [s.cat, s.name, s.level, s.highlight, s.idx]
      );
    }

    // 3. Seed Experiences
    await pool.query('DELETE FROM experiences');
    const experiences = [
      {
        company: 'NVC Group Seniors Lifestyles',
        role: 'Operations Executive & Care Service Employee',
        location: 'Riverside Gardens, Nambucca, Australia',
        start_date: 'May 2025',
        end_date: 'March 2026',
        is_current: false,
        description: 'Bridged frontline clinical healthcare delivery with operational automation systems, spearheading Google Apps Script workflows that eliminated manual inefficiencies across facility care routines.',
        achievements: [
          'Engineered automated staff handover and clinical alert workflows via Google Apps Script, reducing administrative latency by 40%.',
          'Managed resident clinical logistics and medical supply verification adhering to rigorous Australian Aged Care Quality Standards.',
          'Developed automated data tracking sheets for shift transitions, enhancing care continuity and eliminating missed clinical observations.',
        ],
        technologies: ['Google Apps Script', 'JavaScript', 'Clinical Logistics', 'Process Optimization', 'Healthcare Compliance'],
        order_index: 1,
      },
      {
        company: 'NVC Group',
        role: 'Yayasan Peneraju International Scholar / Certificate III in Individual Support',
        location: 'Riverside Gardens, Nambucca, Australia',
        start_date: '2024',
        end_date: '2024',
        is_current: false,
        description: 'Selected for prestigious Yayasan Peneraju overseas scholarship. Completed Australian Certificate III in Individual Support while executing clinical duties under international healthcare protocols.',
        achievements: [
          'Mastered person-centered clinical care delivery, physical rehabilitation support, and emergency response management.',
          'Demonstrated exceptional cross-cultural empathy and communication across diverse multidisciplinary medical teams.',
          'Awarded professional accreditation recognized under Australian National Healthcare standards.',
        ],
        technologies: ['Clinical Ethics', 'Palliative & Geriatric Care', 'Risk Mitigation', 'Cross-Cultural Communication'],
        order_index: 2,
      },
      {
        company: 'Prudential BSN Takaful Berhad',
        role: 'Takaful Advisor',
        location: 'Malaysia',
        start_date: '2023',
        end_date: '2023',
        is_current: false,
        description: 'Advised individual and corporate clients on comprehensive financial protection, medical risk underwriting, and family health security.',
        achievements: [
          'Analyzed client health metrics to design tailored medical and disability coverage portfolios.',
          'Implemented structured client tracking spreadsheets to streamline prospecting and policy renewal monitoring.',
        ],
        technologies: ['Underwriting Principles', 'Client Financial Modeling', 'Risk Assessment', 'CRM Strategy'],
        order_index: 3,
      },
      {
        company: 'Puncak Niaga Holdings Berhad',
        role: 'Project Executive',
        location: 'Malaysia',
        start_date: '2022',
        end_date: '2022',
        is_current: false,
        description: 'Executed project governance, compliance tracking, and stakeholder reporting for large-scale utility and infrastructure projects.',
        achievements: [
          'Monitored project milestone deliverables and reconciled contract expenditure against budget benchmarks.',
          'Coordinated cross-departmental documentation audits and operational risk reviews.',
        ],
        technologies: ['Project Governance', 'Operations Auditing', 'Resource Allocation', 'Milestone Tracking'],
        order_index: 4,
      },
      {
        company: 'Ministry of Agriculture and Food Industries (MAFI)',
        role: 'MyFutureAgro Participant',
        location: 'Malaysia',
        start_date: '2021',
        end_date: '2021',
        is_current: false,
        description: 'Selected for intensive national agro-industry modernization cohort focused on food security telemetry and tech adoption.',
        achievements: [
          'Analyzed supply chain telemetry data and farm-to-table logistics bottlenecks.',
          'Explored data-driven precision farming frameworks to enhance agricultural yield efficiency.',
        ],
        technologies: ['Supply Chain Telemetry', 'Agricultural Logistics', 'Data Analysis'],
        order_index: 5,
      },
      {
        company: 'Malaysia Digital Economy Corporation (MDEC)',
        role: 'GLOW PENJANA Participant',
        location: 'Malaysia',
        start_date: '2020',
        end_date: '2020',
        is_current: false,
        description: 'Completed national digital upskilling program, focusing on remote engineering workflows, international freelancing, and agile collaboration.',
        achievements: [
          'Mastered agile project estimation and international remote delivery practices.',
          'Collaborated on real-world digital client deliverables with strict time and quality constraints.',
        ],
        technologies: ['Digital Freelancing', 'Agile Delivery', 'Remote Collaboration'],
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

    // 4. Seed Projects
    await pool.query('DELETE FROM projects');
    const projects = [
      {
        title: 'URUS: Integrated SME Operations Platform',
        tagline: 'Outbound fulfillment queue, multi-stage order lifecycles, barcode scanning, atomic order claiming',
        description: 'Enterprise-grade warehouse operations and order fulfillment engine designed for high-velocity SMEs. Solves critical warehouse concurrency hazards through atomic order claiming, end-to-end barcode scanning verification, and a strictly enforced finite state machine across all fulfillment stages.',
        architecture_details: 'Architected with a decoupled Node.js/Express service layer on top of PostgreSQL with row-level locks (FOR UPDATE SKIP LOCKED) to guarantee atomic order reservation among simultaneous warehouse operators. Redis acts as a high-speed sub-millisecond cache for outbound pick queues. The frontend is built with React 19 and TailwindCSS v4 with real-time audio and tactile feedback on barcode validation.',
        key_features: [
          'Atomic Order Claiming: Uses PostgreSQL FOR UPDATE SKIP LOCKED to prevent double-picking race conditions among parallel warehouse pickers.',
          'Barcode Scanning Pipeline: Instant handheld/camera scanner integration validating EAN-13, SKU, and QR codes before releasing dispatch labels.',
          'Multi-Stage Order Lifecycle: Rigid state machine (Pending -> Picking -> Staged -> Packed -> Outbound Dispatch) with complete audit trail.',
          'Outbound Fulfillment Queue: Prioritized sorting based on courier cutoff times, SLA urgency, and inventory availability.',
          'Role-Based Access Control (RBAC): Distinct authorization boundaries for floor pickers, inventory managers, and logistics dispatchers.',
          'Real-time Inventory Rebalancing: Automated threshold alerts and dead-stock identification.',
        ],
        tech_stack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'TailwindCSS v4', 'Docker'],
        github_url: 'https://github.com/hafizi-ahmar/urus-operations-platform',
        demo_url: 'https://urus-demo.hafizi.dev',
        featured: true,
        order_index: 1,
      },
      {
        title: 'Antigravity Autonomous Code & Test Harness',
        tagline: 'Multi-agent developer orchestrator with self-healing feedback loops',
        description: 'An autonomous engineering agent harness that breaks down complex user specifications into structured database schemas, generates API routes, verifies type safety, and validates end-to-end integration with automatic rollback capability.',
        architecture_details: 'Implements an agentic coordinator utilizing Google Antigravity and deep reasoning loops. Subagents handle repository analysis, migration generation, and test verification in sandboxed workspaces.',
        key_features: [
          'Autonomous Task Decomposition: Parses PRDs into discrete, atomic commits.',
          'Defensive Type Generation: Auto-generates matching Zod schemas and TypeScript interfaces.',
          'Self-Healing Migration Engine: Validates SQL rollbacks automatically before deployment.',
        ],
        tech_stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Antigravity SDK', 'Docker'],
        github_url: 'https://github.com/hafizi-ahmar/antigravity-harness',
        demo_url: '',
        featured: true,
        order_index: 2,
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

    // 5. Seed Education
    await pool.query('DELETE FROM education');
    const education = [
      {
        institution: 'Project KADA',
        degree: 'AI & Autonomous Software Engineering Fellow',
        period: 'Aug 2026 – Sep 2026',
        field_of_study: 'Autonomous Workflows & Modern Full-Stack',
        description: 'Advanced fellowship focused on building agentic workflows, autonomous code synthesis, multi-agent coordination, and high-performance full-stack architectures.',
        badges: ['Agentic Workflows', 'Antigravity 2.0', 'Full-Stack Architecture'],
        order_index: 1,
      },
      {
        institution: '42 Kuala Lumpur (42KL)',
        degree: '42KL Piscine Intensive',
        period: 'Apr 2026 – May 2026',
        field_of_study: 'Computer Science & Low-Level Systems Programming',
        description: 'Intensive peer-to-peer programming immersion. Solved complex algorithmic problems, built low-level memory allocation tools, and mastered strict Unix C standards with zero dependencies.',
        badges: ['C Programming', 'Memory Management', 'Algorithms', 'Peer-to-Peer Evaluation'],
        order_index: 2,
      },
      {
        institution: 'Universiti Teknologi MARA (UiTM)',
        degree: 'Bachelor of Dietetics (Hons)',
        period: '2016 – 2020',
        field_of_study: 'Clinical Healthcare, Biostatistics & Medical Nutrition',
        description: 'Graduated with Honours. Completed rigorous clinical rotations across Malaysian public hospitals, conducting biostatistical analysis, patient triage, and clinical care workflow audits.',
        badges: ['Clinical Operations', 'Medical Nutrition Therapy', 'Biostatistics', 'Research Methodology'],
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

    logger.info('Database seeded successfully with all authentic records.');
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
