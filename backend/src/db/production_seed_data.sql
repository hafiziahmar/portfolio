--
-- PostgreSQL database dump
--

\restrict BXDaffqikhJ8kyG6GTBG573HzZfFzh5ZlGrtqofXFP1hDwh3ihGV3nfQ9XADktR

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.admins (id, username, email, password_hash, created_at) FROM stdin;
4	hafizi_admin	admin@hafizi.dev	$2a$10$oYABJ8NEtyr3xQO6PTs1Ku/EGVMqN/BZl1pM3phGkOgkcQjNYsmM6	2026-10-21 05:24:14.862686+00
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.education (id, institution, degree, period, field_of_study, description, badges, order_index, created_at, start_date, end_date) FROM stdin;
11	42KL	Piscine Participant ÔÇô Software Engineering	Apr 2026 ÔÇô May 2026	Low-Level Logic, Imperative Logic & C Programming	ÔÇó Completed the intensive, teacherless, peer-to-peer 4-week programming pool focused on low-level logic, algorithmic thinking, and imperative logic structure using C. \nÔÇó Developed high cognitive agility and resilience by resolving complex computing challenges under rigorous automated evaluation systems.	{}	2	2026-10-21 05:24:14.720704+00	Apr 2026	May 2026
12	Universiti Teknologi MARA (UiTM) Puncak Alam	Bachelor of Dietetics (Hons.)	2015 ÔÇô 2020	Clinical Healthcare, Biochemical Nutrition & Data Analysis	ÔÇó Formulated precision Medical Nutrition Therapy (MNT) by interpreting raw biochemical parameters and clinical data inputs. \nÔÇó Utilised behavioral counseling frameworks to systematically deliver and execute clinical dietary interventions. \nÔÇó Executed structured quantitative research methodologies to accurately track, analyze, and report on complex data trends.	{}	3	2026-10-21 05:24:14.722769+00	2015	2020
10	Korea-ASEAN Digital Academy (KADA)	Project KADA Participant ÔÇô AI-Enabled Full-Stack Development	Aug 2026 ÔÇô Sep 2026	Full-Stack Engineering & System Architecture Foundations	ÔÇó Completed comprehensive engineering training spanning domain-driven design (DDD), wireframing/Figma translation, and component-driven frontend architecture using React, Vite, Tailwind CSS, and Zustand. \nÔÇó Directed AI workflows to construct layered REST APIs in Node.js and Express (Routes ÔåÆ Controllers ÔåÆ Services ÔåÆ Repositories) connected to Dockerized PostgreSQL instances using connection pools (pg) and parameterisation against SQL injection. \nÔÇó Implemented stateless JWT authentication, bcrypt password hashing, route-level authorization middleware, and Redis caching with explicit cache-invalidation on database writes.\nÔÇó Formulated systematic prompt specifications (defining roles, technical contexts, data shapes, and edge constraints) to direct AI assistants responsibly across the SDLC while avoiding unverified vibe coding. \nÔÇó Verified system endpoints and contracts using Postman test collections, OpenAPI 3.0/Swagger specifications, and browser DevTools network diagnostics.	{}	1	2026-10-21 05:24:14.717895+00	Aug 2026	Sep 2026
\.


--
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.experiences (id, company, role, location, start_date, end_date, is_current, description, achievements, technologies, order_index, created_at, updated_at) FROM stdin;
21	Prudential BSN Takaful Berhad	Takaful Advisor	Selangor, Malaysia	2023	2023	f	ÔÇó Managed client portfolios, performed risk evaluations, and translated complex financial protection structures into clear, accessible solutions for clients.\nÔÇó Utilised internal enterprise digital platforms and CRM software to streamline application submissions and manage data pipelines.\nÔÇó Maintained strict compliance with financial regulations and industry standards across all client accounts.	{}	{}	3	2026-10-21 05:24:14.697979+00	2026-10-22 04:56:21.343784+00
22	Puncak Niaga Holdings Berhad	Project Executive	Selangor, Malaysia	2022	2022	f	ÔÇó Orchestrated end-to-end project planning, milestone scheduling, and execution for landscaping projects at Masjid Puncak Alam and MaÔÇÖahad Tahfiz Ismail.\nÔÇó Formulated project budgets, executed procurement strategies, managed assets and inventories, and acted as the primary liaison for supplier and contractor negotiations.\nÔÇó Led and supervised a cross-cultural team of 10+ operational workers to optimise daily workflows, reporting project velocity directly to the Director.	{}	{}	4	2026-10-21 05:24:14.700573+00	2026-10-22 04:58:07.397123+00
19	NVC Group Seniors Lifestyles (M) Sdn Bhd	Care Service Employee	Kuala Lumpur, Malaysia	May 2025	Mar 2026	f	ÔÇó Operationalised administration, procurement, compliance, and digital outreach pipelines for an Australian aged-care organisation expanding operations into the Malaysian market.\nÔÇó Engineered and deployed an automated event registration and database feedback system utilising Google Workspace and Google Apps Script, eliminating manual data entry to zero via auto-triggered confirmations and custom e-certificates.\nÔÇó Leveraged structured prompting techniques with LLM assistants to accelerate script writing and prototype operational workflows, bridging healthcare processes with technical automation.	{}	{}	1	2026-10-21 05:24:14.69143+00	2026-10-22 04:53:23.396467+00
20	NVC Group	Yayasan Peneraju International Scholar (Certificate III in Individual Support)	New South Wales, Australia	2024	2024	f	ÔÇó Selected for a competitive global talent scholarship to undergo intensive on-site care operations and compliance training within NV College, alongside a practical placement within NVC GroupÔÇÖs Riverside Gardens Aged Care Facility in New South Wales, Australia.\nÔÇó Mastered strict international healthcare compliance frameworks and adapted operational protocols to global standards while cultivating cross-cultural fluencies.	{}	{}	2	2026-10-21 05:24:14.694989+00	2026-10-22 04:55:05.954967+00
23	Ministry of Agriculture and Food Industries (MAFI)	MyFutureAgro Participant	Kelantan, Malaysia	2021	2021	f	ÔÇó Selected for a competitive agricultural technology initiative focused on deploying modern smart farming infrastructures.\nÔÇó Co-engineered and built a commercial one-acre chili cultivation facility from the ground up, directly installing and configuring automated fertigation delivery systems.	{}	{}	5	2026-10-21 05:24:14.702962+00	2026-10-22 05:00:56.945536+00
24	Malaysia Digital Economy Corporation (MDEC)	Global Online Workforce (GLOW PENJANA) Participant	Kelantan, Malaysia	2020	2020	f	ÔÇó Immersed in specialised training focused on exploring freelance tech ecosystems, digital marketplace onboarding, and remote delivery frameworks.\nÔÇó Formulated professional client outreach pipelines, digital portfolio presentation standards, and cross-border service delivery strategies.\nÔÇó Equipped with structured remote project execution workflows, digital asset management, and independent professional branding strategies.	{}	{}	6	2026-10-21 05:24:14.705257+00	2026-10-22 05:01:55.946016+00
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.messages (id, sender_name, sender_email, sender_organization, subject, message, ip_address, status, created_at) FROM stdin;
6	Patrick Jane	patrickjane@cbi.com	CBI	Senior Full-Stack & AI Engineer Role	Hi Hafizi, we were deeply impressed by your URUS architecture and clinical domain background. We would love to discuss a senior engineering opportunity with you.	::1	unread	2026-10-22 05:53:59.232338+00
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.profile (id, name, title, summary, linkedin_url, github_url, location, status_badge, avatar_url, created_at, updated_at) FROM stdin;
4	Ahmad Hafizi Bin Ahmar	AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise (Dietetics Hons.)	AI-Enabled Full-Stack Developer with a foundation in clinical healthcare and enterprise operations. Skilled at directing autonomous AI agent platforms to rapidly build, test, and ship production-ready web applications. Combines algorithmic thinking from 42KL Piscine with modern full-stack training from Project KADA to translate operational bottlenecks into clean user interfaces, dependable APIs, and structured database systems.	https://www.linkedin.com/in/ahmad-hafizi-ahmar	https://github.com/hafiziahmar	Telok Panglima Garang, Selangor, Malaysia	Open for Full-Stack & AI Roles	\N	2026-10-21 05:24:14.608831+00	2026-10-22 04:51:23.017382+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.projects (id, title, tagline, description, architecture_details, key_features, tech_stack, github_url, demo_url, featured, order_index, created_at, updated_at, start_date, end_date) FROM stdin;
6	URUS ÔÇö Integrated SME Operations Platform (5-Member Agile Team)	Outbound fulfillment queue, multi-stage order lifecycles, barcode scanning, atomic order claiming	ÔÇó Directed autonomous coding agents in Antigravity to build and deliver the Outbound Fulfillment & Dispatch Queue module for an SME operations platform.\nÔÇó Guided the AI implementation of the multi-stage order lifecycle (READY_TO_PICK ÔåÆ PICKING ÔåÆ PACKING ÔåÆ FULFILLED), integrating camera-based barcode scanning for real-time SKU verification.\nÔÇó Prompted and validated order-claiming logic designed to prevent concurrent picking conflicts, ensuring orders could only be claimed by one worker at a time.\nÔÇó Configured end-to-end fulfillment workflows that trigger automatic inventory deductions and emit verified operational events upon order completion.\nÔÇó Verified module data flows against team schemas and API endpoints to ensure outbound completion correctly fed into downstream workforce KPI metrics.		{}	{}			t	1	2026-10-21 05:24:14.711796+00	2026-10-22 05:04:33.361665+00	Aug 2026	Sep 2026
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: portfolio_user
--

COPY public.skills (id, category, name, proficiency_level, highlight, order_index, created_at) FROM stdin;
63	Autonomous AI Development & Workspaces	Antigravity AI Agent Platform	5	t	1	2026-10-21 05:24:14.616188+00
64	Autonomous AI Development & Workspaces	Agentic Workflows	5	t	2	2026-10-21 05:24:14.619852+00
65	Autonomous AI Development & Workspaces	Structured Prompt Engineering (Role-Context-Task-Constraint)	5	t	3	2026-10-21 05:24:14.622661+00
66	Autonomous AI Development & Workspaces	Iterative AI Debugging	5	f	4	2026-10-21 05:24:14.62603+00
67	Autonomous AI Development & Workspaces	Non-Authoritative AI System Boundaries	5	f	5	2026-10-21 05:24:14.628516+00
68	Full-Stack Technologies	React 19	5	t	6	2026-10-21 05:24:14.63116+00
69	Full-Stack Technologies	TypeScript	5	t	7	2026-10-21 05:24:14.633525+00
70	Full-Stack Technologies	JavaScript	5	f	8	2026-10-21 05:24:14.636215+00
71	Full-Stack Technologies	TailwindCSS v4	5	f	9	2026-10-21 05:24:14.638943+00
72	Full-Stack Technologies	Vite	5	f	10	2026-10-21 05:24:14.642346+00
73	Full-Stack Technologies	NestJS	5	f	11	2026-10-21 05:24:14.646396+00
74	Full-Stack Technologies	Node.js / Express	5	t	12	2026-10-21 05:24:14.650508+00
75	Full-Stack Technologies	PostgreSQL 18 (Supabase / Docker)	5	t	13	2026-10-21 05:24:14.652747+00
76	Full-Stack Technologies	Zod Validation	5	f	14	2026-10-21 05:24:14.655266+00
77	Full-Stack Technologies	OpenAPI 3.0 / Swagger	5	f	15	2026-10-21 05:24:14.658035+00
78	Hands-On Verification & Tools	Postman (API Endpoint Verification)	5	t	16	2026-10-21 05:24:14.66063+00
79	Hands-On Verification & Tools	Browser DevTools (Network & State Inspection)	5	t	17	2026-10-21 05:24:14.663157+00
80	Hands-On Verification & Tools	DBeaver (Database GUI)	4	f	18	2026-10-21 05:24:14.665336+00
81	Hands-On Verification & Tools	Git & GitHub (Branching, PRs, Merge Conflicts)	5	t	19	2026-10-21 05:24:14.667283+00
82	Hands-On Verification & Tools	Docker Desktop	4	f	20	2026-10-21 05:24:14.669264+00
83	Hands-On Verification & Tools	Google Apps Script	5	t	21	2026-10-21 05:24:14.67136+00
84	System Design & Workflows	Multi-Stage Order Lifecycles (READY_TO_PICK to FULFILLED)	5	t	22	2026-10-21 05:24:14.673788+00
85	System Design & Workflows	Camera Barcode SKU Verification	5	t	23	2026-10-21 05:24:14.676269+00
86	System Design & Workflows	Atomic Order-Claiming Logic	5	t	24	2026-10-21 05:24:14.679286+00
87	System Design & Workflows	Data-Driven UI States (Loading, Error, Empty, Success)	5	f	25	2026-10-21 05:24:14.682182+00
88	System Design & Workflows	Role-Based Access Control (RBAC)	5	f	26	2026-10-21 05:24:14.684791+00
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.admins_id_seq', 4, true);


--
-- Name: education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.education_id_seq', 12, true);


--
-- Name: experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.experiences_id_seq', 24, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.messages_id_seq', 6, true);


--
-- Name: profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.profile_id_seq', 4, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.projects_id_seq', 6, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio_user
--

SELECT pg_catalog.setval('public.skills_id_seq', 89, true);


--
-- PostgreSQL database dump complete
--

\unrestrict BXDaffqikhJ8kyG6GTBG573HzZfFzh5ZlGrtqofXFP1hDwh3ihGV3nfQ9XADktR

