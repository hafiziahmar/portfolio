import { Router, Request, Response } from 'express';
import portfolioRoutes from './portfolio.routes.js';
import messageRoutes from './message.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import copilotRoutes from './copilot.routes.js';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'hafizi-portfolio-api',
  });
});

router.use('/portfolio', portfolioRoutes);
router.use('/messages', messageRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/copilot', copilotRoutes);

export default router;
