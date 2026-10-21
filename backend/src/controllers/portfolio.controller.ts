import { Request, Response, NextFunction } from 'express';
import { portfolioService } from '../services/portfolio.service.js';
import { skillRepo } from '../repositories/skill.repo.js';
import { experienceRepo } from '../repositories/experience.repo.js';
import { projectRepo } from '../repositories/project.repo.js';
import { educationRepo } from '../repositories/education.repo.js';

export class PortfolioController {
  async getFullPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bypass = req.query.refresh === 'true';
      const data = await portfolioService.getFullPortfolioData(bypass);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await skillRepo.getAllSkills();
      res.json(skills);
    } catch (err) {
      next(err);
    }
  }

  async getExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const experiences = await experienceRepo.getAllExperiences();
      res.json(experiences);
    } catch (err) {
      next(err);
    }
  }

  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await projectRepo.getAllProjects();
      res.json(projects);
    } catch (err) {
      next(err);
    }
  }

  async getEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const education = await educationRepo.getAllEducation();
      res.json(education);
    } catch (err) {
      next(err);
    }
  }
}

export const portfolioController = new PortfolioController();
