import React, { useEffect, useRef } from 'react';
import { X, Award, Calendar } from 'lucide-react';
import { Education } from '../types';

interface EducationModalProps {
  education: Education | null;
  onClose: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({ education, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (education) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }

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
  }, [education, onClose]);

  if (!education) return null;

  const dateText = education.start_date && education.end_date
    ? (education.start_date.trim() === education.end_date.trim()
        ? education.start_date
        : `${education.start_date} – ${education.end_date}`)
    : (education.period || education.start_date || '');

  return (
    <dialog
      ref={dialogRef}
      // @ts-ignore modern declarative closedby attribute per modern web guidance
      closedby="any"
      onClose={onClose}
      aria-labelledby="modal-education-title"
      className="m-auto p-0 rounded-2xl bg-sand-surface border border-sand-border text-sand-text shadow-2xl max-w-2xl w-full backdrop:backdrop-blur-xs open:animate-in open:fade-in-50"
    >
      <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-sand-border pb-4 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-sand-amber">
              <Award className="w-3.5 h-3.5" />
              <span>Academic & Training Program</span>
            </div>
            <h2 id="modal-education-title" className="text-xl sm:text-2xl font-bold text-sand-text mt-1 leading-snug">
              {education.degree}
            </h2>
            <p className="text-sm font-semibold text-sand-moss mt-0.5">
              {education.institution}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {dateText && (
              <span className="inline-flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-sand-surface-muted border border-sand-border text-sand-text-muted">
                <Calendar className="w-3 h-3 text-sand-amber" />
                <span>{dateText}</span>
              </span>
            )}
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Detailed Description Word-for-Word */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sand-text-muted font-mono">
            Detailed Program Description & Curriculum
          </h3>
          <div className="text-sm sm:text-base text-sand-text leading-relaxed whitespace-pre-line text-justify">
            {education.description}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-sand-border flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </dialog>
  );
};
