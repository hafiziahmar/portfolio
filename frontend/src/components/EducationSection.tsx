import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
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
          <p className="text-base text-sand-text-muted">
            Blending deep clinical domain healthcare degree credentials with algorithmic systems coding and cutting-edge autonomous AI fellowships.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4 hover:border-sand-moss transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-sand-moss/10 text-sand-moss">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-sand-surface-muted border border-sand-border text-sand-text-muted">
                    {edu.period}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-sand-text leading-snug">
                    {edu.degree}
                  </h3>
                  <p className="text-xs font-semibold text-sand-moss mt-1">
                    {edu.institution}
                  </p>
                  {edu.field_of_study && (
                    <p className="text-2xs font-mono text-sand-text-muted mt-0.5">
                      {edu.field_of_study}
                    </p>
                  )}
                </div>

                {edu.description && (
                  <p className="text-xs text-sand-text-muted leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>

              {/* Badges */}
              {edu.badges && edu.badges.length > 0 && (
                <div className="pt-3 border-t border-sand-border flex flex-wrap gap-1.5">
                  {edu.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-2xs font-mono px-2 py-0.5 rounded-md bg-sand-surface-muted text-sand-moss font-medium border border-sand-border"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
