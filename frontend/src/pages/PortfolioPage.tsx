import React, { useEffect, useState, useCallback } from 'react';
import { PortfolioData } from '../types';
import { api } from '../api/client';
import { Hero } from '../components/Hero';
import { ProjectsSection } from '../components/ProjectsSection';
import { ExperienceTimeline } from '../components/ExperienceTimeline';
import { SkillsMatrix } from '../components/SkillsMatrix';
import { EducationSection } from '../components/EducationSection';
import { ContactSection } from '../components/ContactSection';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { RefreshCw } from 'lucide-react';

interface PortfolioPageProps {
  onOpenCopilot: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenCopilot }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPortfolioData = useCallback(async (bypassCache = false) => {
    if (bypassCache) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await api.getPortfolio(bypassCache);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the portfolio database service.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData(false);
  }, [fetchPortfolioData]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error || 'No portfolio data could be retrieved from the server.'}
        onRetry={() => fetchPortfolioData(true)}
      />
    );
  }

  return (
    <main className="min-h-screen">
      {/* Live Cache & Data-Engine Status Bar */}
      <div className="bg-sand-surface-muted/60 border-b border-sand-border py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-2xs font-mono text-sand-text-muted">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sand-moss opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sand-moss"></span>
            </span>
            <span>Relational CMS (PostgreSQL + Redis Cache)</span>
            <span className="hidden sm:inline text-sand-border">&bull;</span>
            <span className="hidden sm:inline text-sand-moss font-semibold">Strict REST Layer</span>
          </div>

          <div className="flex items-center space-x-3">
            {data.cachedAt && (
              <span className="hidden md:inline">
                Cached: {new Date(data.cachedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => fetchPortfolioData(true)}
              disabled={isRefreshing}
              type="button"
              className="inline-flex items-center space-x-1 text-sand-text-muted hover:text-sand-text disabled:opacity-50 transition-colors cursor-pointer"
              title="Invalidate Redis & Fetch Fresh DB Data"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sand-amber' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Bypass Cache'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <Hero profile={data.profile} onOpenCopilot={onOpenCopilot} />
      <ProjectsSection projects={data.projects || []} />
      <ExperienceTimeline experiences={data.experiences || []} />
      <SkillsMatrix skills={data.skills || []} />
      <EducationSection education={data.education || []} />
      <ContactSection />
    </main>
  );
};
