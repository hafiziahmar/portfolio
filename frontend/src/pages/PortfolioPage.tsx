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

interface PortfolioPageProps {
  onOpenCopilot: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenCopilot }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = useCallback(async (bypassCache = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getPortfolio(bypassCache);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the portfolio service.');
    } finally {
      setIsLoading(false);
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
