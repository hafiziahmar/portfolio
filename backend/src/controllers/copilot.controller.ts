import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { copilotService } from '../services/copilot.service.js';

export const chatQuerySchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ).optional().default([]),
});

export class CopilotController {
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, history } = req.body;
      const answer = await copilotService.processQuery(message, history);

      res.json({
        reply: answer,
        engine: copilotService.lastDebugInfo,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const copilotController = new CopilotController();
