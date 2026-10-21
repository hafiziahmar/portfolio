import { Router } from 'express';
import { copilotController, chatQuerySchema } from '../controllers/copilot.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { copilotLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post(
  '/chat',
  copilotLimiter,
  validateBody(chatQuerySchema),
  copilotController.chat.bind(copilotController)
);

export default router;
