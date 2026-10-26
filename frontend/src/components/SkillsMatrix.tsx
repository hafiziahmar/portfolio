import React, { useState, useMemo } from 'react';
import { Wrench } from 'lucide-react';
import { Skill } from '../types';

interface SkillsMatrixProps {
  skills: Skill[];
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories dynamically from the database
  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category))).filter(Boolean);
    return ['All', ...unique];
  }, [skills]);

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="skills" className="py-20 border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-amber font-mono">
            <Wrench className="w-4 h-4" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-text tracking-tight">
            Categorised Skill Matrix
          </h2>
          <p className="text-base text-sand-text-muted text-justify">
            Engineered across autonomous AI systems, modern full-stack frameworks, database architecture, and verification tooling.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sand-moss text-white shadow-xs'
                  : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl border border-sand-border bg-sand-surface shadow-2xs space-y-3 transition-all hover:border-sand-moss/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-2xs font-mono font-medium text-sand-moss uppercase block mb-0.5">
                    {skill.category}
                  </span>
                  <h3 className="text-sm font-bold text-sand-text">
                    {skill.name}
                  </h3>
                </div>
              </div>

              {/* Proficiency Level Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-2xs font-mono text-sand-text-muted">
                  <span>Proficiency</span>
                  <span className="font-semibold text-sand-moss">{skill.proficiency_level} / 5</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-sand-surface-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sand-moss transition-all duration-500"
                    style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
