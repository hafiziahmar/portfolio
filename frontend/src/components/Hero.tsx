import React from 'react';
import { ArrowRight, Bot, Linkedin, Github, CheckCircle2, Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import { Profile } from '../types';

interface HeroProps {
  profile: Profile | null;
  onOpenCopilot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenCopilot }) => {
  const name = profile?.name || 'Ahmad Hafizi Bin Ahmar';
  const title = profile?.title || 'AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise (Dietetics Hons.)';
  const summary = profile?.summary || 'AI-Enabled Full-Stack Developer with a foundation in clinical healthcare and enterprise operations. Skilled at directing autonomous AI agent platforms to rapidly build, test, and ship production-ready web applications. Combines algorithmic thinking from 42KL Piscine with modern full-stack training from Project KADA to translate operational bottlenecks into clean user interfaces, dependable APIs, and structured database systems.';
  const linkedinUrl = profile?.linkedin_url || 'https://www.linkedin.com/in/ahmad-hafizi-ahmar';
  const githubUrl = profile?.github_url || 'https://github.com/hafiziahmar';

  return (
    <section id="about" className="pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Avatar & Headline Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src="/hafizi.jpg"
                  alt="Hafizi Ahmar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-sand-border shadow-md bg-sand-surface"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-sand-surface rounded-full border border-sand-border shadow-xs" title="Available for opportunities">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sand-moss opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sand-moss"></span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {/* Availability Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sand-surface border border-sand-border shadow-2xs">
                  <span className="text-2xs font-semibold tracking-wide text-sand-moss font-mono uppercase">
                    &bull; {profile?.status_badge || 'Open for Full-Stack & AI Roles'}
                  </span>
                </div>

                {/* Name & Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-sand-text leading-tight">
                  {name}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-sand-moss">
                  {title}
                </p>
              </div>
            </div>

            {/* Executive Bio */}
            <p className="text-base sm:text-lg text-sand-text-muted max-w-2xl leading-relaxed text-justify">
              {summary}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sand-moss text-white font-medium hover:bg-sand-moss-hover transition-all shadow-xs cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sand-surface border border-sand-border text-sand-text font-medium hover:bg-sand-surface-muted transition-all shadow-2xs cursor-pointer"
              >
                <span>Send Recruiter Inquiry</span>
              </a>

              <button
                onClick={onOpenCopilot}
                type="button"
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-sand-amber/15 text-sand-amber border border-sand-amber/30 font-medium hover:bg-sand-amber/25 transition-all shadow-2xs cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Copilot</span>
              </button>
            </div>

            {/* Professional Links */}
            <div className="flex items-center space-x-4 pt-3 text-sand-text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                Verified Profiles:
              </span>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-medium hover:text-sand-text transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-sand-moss" />
                <span>LinkedIn</span>
              </a>
              <span className="text-sand-border">&bull;</span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-medium hover:text-sand-text transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4 text-sand-moss" />
                <span>GitHub</span>
              </a>
            </div>

          </div>

          {/* Architectural / Pedigree Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-7 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-sand-border pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-sand-moss/10 text-sand-moss">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-sand-text">Core Qualifications</h2>
                    <p className="text-xs text-sand-text-muted">Verified Technical & Clinical Credentials</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-sand-surface-muted text-sand-text-muted border border-sand-border">
                  42KL &bull; KADA &bull; UiTM
                </span>
              </div>

              {/* Pillars */}
              <div className="space-y-4">
                
                {/* Pillar 1 */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1 p-1.5 rounded-lg bg-sand-moss/15 text-sand-moss">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sand-text">
                      Project KADA & Full-Stack Architecture
                    </h3>
                    <p className="text-xs text-sand-text-muted mt-0.5 text-justify">
                      Domain-driven design, layered REST APIs (Node.js/Express), stateless JWT & bcrypt authentication, and PostgreSQL data integrity.
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1 p-1.5 rounded-lg bg-sand-amber/15 text-sand-amber">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sand-text">
                      Autonomous AI Workflows & Antigravity
                    </h3>
                    <p className="text-xs text-sand-text-muted mt-0.5 text-justify">
                      Structured prompt engineering (Role-Context-Task-Constraint), agentic workflows, iterative debugging, and non-authoritative boundaries.
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1 p-1.5 rounded-lg bg-sand-moss/15 text-sand-moss">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sand-text">
                      42KL Piscine Intensive
                    </h3>
                    <p className="text-xs text-sand-text-muted mt-0.5 text-justify">
                      Teacherless, peer-to-peer programming pool focused on low-level logic, algorithmic thinking, and imperative logic structure in C.
                    </p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-1 p-1.5 rounded-lg bg-sand-amber/15 text-sand-amber">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sand-text">
                      Clinical Healthcare Foundation
                    </h3>
                    <p className="text-xs text-sand-text-muted mt-0.5 text-justify">
                      UiTM Bachelor of Dietetics (Hons.) & NVC Group operations: Translating clinical precision and operational bottlenecks into automated systems.
                    </p>
                  </div>
                </div>

              </div>

              {/* Verified Status */}
              <div className="pt-3 border-t border-sand-border flex items-center justify-between text-xs text-sand-text-muted">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sand-moss" />
                  <span>Verified Academic & Professional Credentials</span>
                </span>
                <span className="font-mono text-sand-moss font-semibold text-2xs">
                  Active
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
