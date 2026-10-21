import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CopilotDrawer } from './components/CopilotDrawer';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Sync hash routing e.g. #admin or /admin
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const navigateToPortfolio = () => {
    window.location.hash = '';
    setCurrentView('portfolio');
  };

  return (
    <div className="min-h-screen bg-sand-bg text-sand-text flex flex-col font-sans transition-colors duration-200">
      <Navbar
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onNavigateAdmin={navigateToAdmin}
        isAdminView={currentView === 'admin'}
        onBackToPortfolio={navigateToPortfolio}
      />

      <div className="flex-1">
        {currentView === 'portfolio' ? (
          <PortfolioPage onOpenCopilot={() => setIsCopilotOpen(true)} />
        ) : (
          <AdminPage onBackToPortfolio={navigateToPortfolio} />
        )}
      </div>

      <Footer onNavigateAdmin={navigateToAdmin} />

      {/* Floating Quick Copilot Trigger (on mobile / scroll) */}
      {currentView === 'portfolio' && !isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          type="button"
          className="fixed bottom-6 right-6 z-30 flex items-center space-x-2 px-4 py-3 rounded-full bg-sand-amber text-white font-bold text-xs shadow-lg hover:bg-sand-amber-hover transition-transform hover:scale-105 cursor-pointer"
          aria-label="Open AI Copilot"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* AI CV Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
};

export default App;
