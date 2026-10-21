import { profileRepo, ProfileRecord } from '../repositories/profile.repo.js';
import { skillRepo, SkillRecord } from '../repositories/skill.repo.js';
import { experienceRepo, ExperienceRecord } from '../repositories/experience.repo.js';
import { projectRepo, ProjectRecord } from '../repositories/project.repo.js';
import { educationRepo, EducationRecord } from '../repositories/education.repo.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export interface PortfolioData {
  profile: ProfileRecord | null;
  skills: SkillRecord[];
  experiences: ExperienceRecord[];
  projects: ProjectRecord[];
  education: EducationRecord[];
  cachedAt?: string;
}

const CACHE_KEY = 'portfolio:full_data';
const CACHE_TTL_SECONDS = 300; // 5 minutes

export class PortfolioService {
  async getFullPortfolioData(bypassCache = false): Promise<PortfolioData> {
    if (!bypassCache) {
      try {
        const cached = await cache.get(CACHE_KEY);
        if (cached) {
          logger.debug('Returning cached portfolio data');
          return JSON.parse(cached);
        }
      } catch (err) {
        logger.warn('Error reading from cache, fetching from database', err);
      }
    }

    logger.debug('Fetching fresh portfolio data from database');
    const [profile, skills, experiences, projects, education] = await Promise.all([
      profileRepo.getProfile(),
      skillRepo.getAllSkills(),
      experienceRepo.getAllExperiences(),
      projectRepo.getAllProjects(),
      educationRepo.getAllEducation(),
    ]);

    const data: PortfolioData = {
      profile,
      skills,
      experiences,
      projects,
      education,
      cachedAt: new Date().toISOString(),
    };

    try {
      await cache.set(CACHE_KEY, JSON.stringify(data), CACHE_TTL_SECONDS);
    } catch (err) {
      logger.warn('Failed to write portfolio data to cache', err);
    }

    return data;
  }

  async invalidateCache(): Promise<void> {
    try {
      await cache.del(CACHE_KEY);
      logger.info('Portfolio cache invalidated.');
    } catch (err) {
      logger.warn('Failed to invalidate cache', err);
    }
  }
}

export const portfolioService = new PortfolioService();
