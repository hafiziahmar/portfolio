import React from 'react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { Education } from '../types';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-amber font-mono">
            <GraduationCap className="w-4 h-4" />
            <span>Academic & Technical Foundations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-text tracking-tight">
            Education & Specialized Training
          </h2>
          <p className="text-base text-sand-text-muted text-justify">
            Academic degrees, technical fellowships, and systems programming intensives.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => {
            const dateText = edu.start_date && edu.end_date
              ? (edu.start_date.trim() === edu.end_date.trim() ? edu.start_date : `${edu.start_date} – ${edu.end_date}`)
              : (edu.period || edu.start_date || '');

            return (
              <div
                key={edu.id}
                className="rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4 hover:border-sand-moss transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-sand-moss/10 text-sand-moss">
                      <Award className="w-5 h-5" />
                    </div>
                    {dateText && (
                      <span className="inline-flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-sand-surface-muted border border-sand-border text-sand-text-muted shrink-0">
                        <Calendar className="w-3 h-3 text-sand-amber" />
                        <span>{dateText}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-sand-text leading-snug">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-sand-moss mt-1">
                      {edu.institution}
                    </p>
                  </div>

                  {edu.description && (
                    <div className="text-xs text-sand-text-muted leading-relaxed whitespace-pre-line text-justify pt-1">
                      {edu.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
