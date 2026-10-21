import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-amber font-mono">
            <Briefcase className="w-4 h-4" />
            <span>Career Progression</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-text tracking-tight">
            Professional Experience Timeline
          </h2>
          <p className="text-base text-sand-text-muted">
            From clinical operations in Australia and process automation to enterprise project execution and tech modernization.
          </p>
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l-2 border-sand-border ml-3 sm:ml-6 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-7 sm:pl-10 group">
              
              {/* Timeline Bullet */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-sand-border bg-sand-surface group-hover:border-sand-moss group-hover:bg-sand-moss transition-colors"></div>

              {/* Card Container */}
              <div className="rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-7 shadow-xs space-y-4 transition-all hover:shadow-md">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-border pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-sand-text">
                      {exp.role}
                    </h3>
                    <div className="text-sm font-semibold text-sand-moss mt-0.5">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-sand-text-muted font-mono">
                    <span className="inline-flex items-center space-x-1.5 bg-sand-surface-muted px-2.5 py-1 rounded-md border border-sand-border">
                      <Calendar className="w-3.5 h-3.5 text-sand-amber" />
                      <span>
                        {!exp.end_date || exp.start_date.trim() === exp.end_date.trim()
                          ? exp.start_date
                          : `${exp.start_date} – ${exp.end_date}`}
                      </span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center space-x-1 text-sand-text-muted">
                        <MapPin className="w-3.5 h-3.5 text-sand-moss" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-sand-text leading-relaxed whitespace-pre-line text-justify">
                  {exp.description}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
