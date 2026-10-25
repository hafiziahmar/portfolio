import React, { useState } from 'react';
import { Bot, Shield, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenCopilot: () => void;
  onNavigateAdmin: () => void;
  isAdminView?: boolean;
  onBackToPortfolio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCopilot,
  onNavigateAdmin,
  isAdminView = false,
  onBackToPortfolio,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Project', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skill', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-sand-bg/85 border-b border-sand-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <a
            href="#about"
            onClick={(e) => {
              if (isAdminView && onBackToPortfolio) {
                e.preventDefault();
                onBackToPortfolio();
              }
            }}
            className="group flex items-center space-x-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-sand-moss flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
              HA
            </div>
            <div>
              <span className="font-semibold text-sand-text text-base tracking-tight block group-hover:text-sand-moss transition-colors">
                Hafizi Ahmar
              </span>
              <span className="text-xs text-sand-text-muted block leading-none font-mono">
                Full-Stack &bull; AI
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        {!isAdminView && (
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-sand-text-muted hover:text-sand-text hover:underline underline-offset-8 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {!isAdminView && (
            <button
              onClick={onOpenCopilot}
              type="button"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sand-amber/15 text-sand-amber hover:bg-sand-amber/25 border border-sand-amber/30 transition-all cursor-pointer shadow-2xs"
              title="Open AI CV Copilot Chat"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          )}

          <ThemeToggle />

          {isAdminView ? (
            <button
              onClick={onBackToPortfolio}
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sand-moss text-white hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
            >
              View Portfolio
            </button>
          ) : (
            <button
              onClick={onNavigateAdmin}
              type="button"
              className="p-2 rounded-xl text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted transition-colors border border-transparent hover:border-sand-border cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              <span className="sr-only">Admin Portal</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          {!isAdminView && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {!isAdminView && mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-border bg-sand-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-sand-text hover:bg-sand-surface-muted transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
