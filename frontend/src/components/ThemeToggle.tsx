import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2 rounded-xl border border-sand-border bg-sand-surface hover:bg-sand-surface-muted transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sand-moss shadow-xs cursor-pointer"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-sand-amber transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-sand-moss transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
