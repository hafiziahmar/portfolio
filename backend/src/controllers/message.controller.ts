import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { messageService } from '../services/message.service.js';

export const createMessageSchema = z.object({
  sender_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  sender_email: z.string().email('Please enter a valid email address').max(150),
  sender_organization: z.string().max(150).optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  honeypot: z.string().optional(),
});

export class MessageController {
  async submitMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const result = await messageService.submitRecruiterMessage({
        ...req.body,
        ip_address: clientIp.split(',')[0].trim(),
      });

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been safely received. Hafizi will review your message promptly.',
        id: result.messageId,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const messageController = new MessageController();
