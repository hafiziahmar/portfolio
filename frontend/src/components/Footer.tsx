import React from 'react';
import { Linkedin, Github, Shield } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  return (
    <footer className="border-t border-sand-border bg-sand-surface py-12 text-sand-text-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copy */}
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-semibold text-sand-text text-sm">
            Ahmad Hafizi Bin Ahmar &bull; Portfolio
          </p>
          <p className="text-2xs text-sand-text-muted">
            Engineered with React 19, TypeScript, PostgreSQL, and natural earth ergonomics.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <a
            href="https://www.linkedin.com/in/ahmad-hafizi-ahmar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-sand-text transition-colors"
          >
            <Linkedin className="w-4 h-4 text-sand-moss" />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/hafiziahmar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-sand-text transition-colors"
          >
            <Github className="w-4 h-4 text-sand-moss" />
            <span>GitHub</span>
          </a>

          <button
            onClick={onNavigateAdmin}
            type="button"
            className="flex items-center space-x-1 text-sand-text-muted hover:text-sand-text transition-colors cursor-pointer"
            title="Admin CMS Portal"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>CMS Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
