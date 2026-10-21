import { Router } from 'express';
import { authController, loginSchema } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

router.get(
  '/me',
  requireAuth as any,
  authController.me.bind(authController)
);

router.put(
  '/password',
  requireAuth as any,
  authController.changePassword.bind(authController)
);

export default router;
