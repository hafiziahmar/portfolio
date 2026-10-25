import React, { useState } from 'react';
import { Cpu, Calendar, ExternalLink, Github, Terminal } from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            Production Systems & Project
          </h2>
          <p className="text-base text-sand-text-muted text-justify">
            Full-stack platforms, autonomous agentic implementations, and enterprise software systems engineered by Hafizi Ahmar.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {projects.map((project) => {
            const dateText = project.start_date && project.end_date
              ? (project.start_date.trim() === project.end_date.trim()
                  ? project.start_date
                  : `${project.start_date} – ${project.end_date}`)
              : (project.start_date || project.end_date || '');

            return (
              <div
                key={project.id}
                className="rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-8 lg:p-9 shadow-xs space-y-5 hover:border-sand-moss/60 hover:shadow-md transition-all"
              >
                {/* Header: Project Name & Dates */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-border pb-5">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-sand-text tracking-tight">
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className="text-xs sm:text-sm font-semibold text-sand-moss">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {dateText && (
                      <span className="inline-flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-sand-surface-muted border border-sand-border text-sand-text-muted">
                        <Calendar className="w-3.5 h-3.5 text-sand-amber" />
                        <span>{dateText}</span>
                      </span>
                    )}

                    {project.architecture_details && (
                      <button
                        onClick={() => setSelectedProject(project)}
                        type="button"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sand-moss/10 text-sand-moss border border-sand-moss/20 text-xs font-semibold hover:bg-sand-moss/20 transition-colors cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Architecture Details</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Description (CV content, formatted, with text-justify) */}
                <div className="text-sm text-sand-text leading-relaxed whitespace-pre-line text-justify">
                  {project.description}
                </div>

                {/* Optional Links */}
                {(project.github_url || project.demo_url) && (
                  <div className="pt-2 flex items-center space-x-4 text-xs font-medium">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-sand-moss hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-sand-moss hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal Dialog for Deep Architecture if present */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
