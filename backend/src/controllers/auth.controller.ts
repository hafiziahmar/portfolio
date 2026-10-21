import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);

      if (!result) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      res.json({
        message: 'Authentication successful',
        token: result.token,
        admin: result.admin,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const admin = await authService.verifyAdmin(req.admin.adminId);
      if (!admin) {
        res.status(404).json({ error: 'Admin record not found' });
        return;
      }

      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
