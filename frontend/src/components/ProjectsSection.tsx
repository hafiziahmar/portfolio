import React, { useState } from 'react';
import { Layers, ArrowRight, Zap, ShieldCheck, QrCode, Cpu, Terminal } from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const urusProject = projects.find((p) => p.title.toLowerCase().includes('urus')) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== urusProject?.id);

  return (
    <section id="projects" className="py-20 border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-amber font-mono">
            <Cpu className="w-4 h-4" />
            <span>Featured Engineering Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-text tracking-tight">
            Production Systems & Architecture
          </h2>
          <p className="text-base text-sand-text-muted">
            Mission-critical applications built with strict database concurrency controls, high-throughput in-memory caching, and verified state machines.
          </p>
        </div>

        {/* Spotlight: URUS Operations Platform */}
        {urusProject && (
          <div className="rounded-2xl border border-sand-border bg-sand-surface shadow-xs overflow-hidden mb-12">
            <div className="p-6 sm:p-8 lg:p-10 space-y-8">
              
              {/* Top Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-border pb-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sand-amber/15 text-sand-amber text-xs font-bold font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    <span>FLAGSHIP SYSTEM &bull; URUS PLATFORM</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-sand-text">
                    {urusProject.title}
                  </h3>
                  <p className="text-sm font-medium text-sand-moss">
                    {urusProject.tagline}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => setSelectedProject(urusProject)}
                    type="button"
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Inspect Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Core System Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Highlight 1: Atomic Claiming */}
                <div className="p-5 rounded-xl bg-sand-surface-muted border border-sand-border space-y-2.5">
                  <div className="p-2 w-fit rounded-lg bg-sand-moss/15 text-sand-moss">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-sand-text">Atomic Order Claiming</h4>
                  <p className="text-xs text-sand-text-muted leading-relaxed">
                    Uses PostgreSQL row locks (<code className="text-xs font-mono font-bold text-sand-moss">FOR UPDATE SKIP LOCKED</code>) to eliminate double-picking race conditions among concurrent warehouse pickers.
                  </p>
                </div>

                {/* Highlight 2: Barcode Scanning */}
                <div className="p-5 rounded-xl bg-sand-surface-muted border border-sand-border space-y-2.5">
                  <div className="p-2 w-fit rounded-lg bg-sand-amber/15 text-sand-amber">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-sand-text">Barcode Scanning Pipeline</h4>
                  <p className="text-xs text-sand-text-muted leading-relaxed">
                    Instant handheld scanner & mobile camera integration validating EAN-13, SKU, and QR payloads before releasing shipping labels.
                  </p>
                </div>

                {/* Highlight 3: Outbound Queue & State Machine */}
                <div className="p-5 rounded-xl bg-sand-surface-muted border border-sand-border space-y-2.5">
                  <div className="p-2 w-fit rounded-lg bg-sand-moss/15 text-sand-moss">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-sand-text">Redis Sub-ms Outbound Queue</h4>
                  <p className="text-xs text-sand-text-muted leading-relaxed">
                    High-velocity pick queue backed by Redis in-memory caching with strict multi-stage order lifecycle transitions and audit logs.
                  </p>
                </div>

              </div>

              {/* Tech Stack Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-sand-text-muted uppercase font-semibold mr-1">
                  Stack:
                </span>
                {urusProject.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-sand-surface border border-sand-border text-sand-text font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Additional Projects Grid */}
        {otherProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherProjects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-sand-border bg-sand-surface p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-sand-moss/10 text-sand-moss">
                      <Terminal className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-sand-text">
                    {p.title}
                  </h3>
                  <p className="text-xs font-medium text-sand-moss">
                    {p.tagline}
                  </p>
                  <p className="text-xs text-sand-text-muted line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-sand-border">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-2xs font-mono px-2 py-0.5 rounded-md bg-sand-surface-muted text-sand-text-muted border border-sand-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(p)}
                    type="button"
                    className="w-full py-2 px-3 rounded-xl border border-sand-border text-xs font-semibold text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Dialog */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
