import { Request, Response, NextFunction } from 'express';
import { profileRepo } from '../repositories/profile.repo.js';
import { skillRepo } from '../repositories/skill.repo.js';
import { experienceRepo } from '../repositories/experience.repo.js';
import { projectRepo } from '../repositories/project.repo.js';
import { educationRepo } from '../repositories/education.repo.js';
import { messageService } from '../services/message.service.js';
import { portfolioService } from '../services/portfolio.service.js';

export class AdminController {
  // Profile
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await profileRepo.updateProfile(req.body);
      await portfolioService.invalidateCache();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // Skills
  async createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await skillRepo.createSkill(req.body);
      await portfolioService.invalidateCache();
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const updated = await skillRepo.updateSkill(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Skill not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const success = await skillRepo.deleteSkill(id);
      if (!success) {
        res.status(404).json({ error: 'Skill not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json({ success: true, message: 'Skill deleted' });
    } catch (err) {
      next(err);
    }
  }

  // Experiences
  async createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await experienceRepo.createExperience(req.body);
      await portfolioService.invalidateCache();
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  async updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const updated = await experienceRepo.updateExperience(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Experience not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const success = await experienceRepo.deleteExperience(id);
      if (!success) {
        res.status(404).json({ error: 'Experience not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json({ success: true, message: 'Experience deleted' });
    } catch (err) {
      next(err);
    }
  }

  // Projects
  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await projectRepo.createProject(req.body);
      await portfolioService.invalidateCache();
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const updated = await projectRepo.updateProject(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const success = await projectRepo.deleteProject(id);
      if (!success) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      await portfolioService.invalidateCache();
      res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
      next(err);
    }
  }

  // Messages Queue
  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await messageService.getAllMessages();
      res.json(messages);
    } catch (err) {
      next(err);
    }
  }

  async updateMessageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const { status } = req.body;
      const updated = await messageService.updateStatus(id, status);
      if (!updated) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const success = await messageService.deleteMessage(id);
      if (!success) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
      res.json({ success: true, message: 'Message removed from queue' });
    } catch (err) {
      next(err);
    }
  }

  // Invalidate Cache
  async flushCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await portfolioService.invalidateCache();
      res.json({ success: true, message: 'Cache successfully invalidated' });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
