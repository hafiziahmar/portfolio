import { Router } from 'express';
import { messageController, createMessageSchema } from '../controllers/message.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { contactFormLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post(
  '/',
  contactFormLimiter,
  validateBody(createMessageSchema),
  messageController.submitMessage.bind(messageController)
);

export default router;
