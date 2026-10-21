import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, Terminal } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }

    // Modern Web Guidance: Fallback for browsers without native <dialog closedby>
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      // @ts-ignore modern declarative closedby attribute per modern web guidance
      closedby="any"
      onClose={onClose}
      aria-labelledby="modal-project-title"
      className="m-auto p-0 rounded-2xl bg-sand-surface border border-sand-border text-sand-text shadow-2xl max-w-2xl w-full backdrop:backdrop-blur-xs open:animate-in open:fade-in-50"
    >
      <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-sand-border pb-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sand-amber">
              Architectural Deep Dive
            </span>
            <h2 id="modal-project-title" className="text-2xl font-bold text-sand-text mt-1">
              {project.title}
            </h2>
            <p className="text-sm text-sand-moss mt-0.5">
              {project.tagline}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sand-text-muted font-mono">
            System Overview & Details
          </h3>
          <div className="text-sm text-sand-text-muted leading-relaxed whitespace-pre-line text-justify">
            {project.description}
          </div>
        </div>

        {/* Architecture Details */}
        {project.architecture_details && (
          <div className="p-4 rounded-xl bg-sand-surface-muted border border-sand-border space-y-2">
            <div className="flex items-center space-x-2 text-sand-moss">
              <Terminal className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Concurrency & Data Pipeline Design
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-sand-text-muted leading-relaxed font-sans text-justify whitespace-pre-line">
              {project.architecture_details}
            </p>
          </div>
        )}

        {/* Key Features */}
        {project.key_features && project.key_features.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sand-text-muted font-mono">
              Core Technical Capabilities
            </h3>
            <ul className="space-y-2">
              {project.key_features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-sand-text-muted text-justify">
                  <CheckCircle2 className="w-4 h-4 text-sand-moss shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Pills */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sand-text-muted font-mono">
              Integrated Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-sand-surface border border-sand-border text-sand-moss font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-sand-border flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </dialog>
  );
};
