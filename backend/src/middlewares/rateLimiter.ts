import rateLimit from 'express-rate-limit';

// Standard rate limiter for public API endpoints: 120 requests per minute
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down and try again shortly.' },
});

// Stricter limiter for contact form submissions: 5 submissions per 10 minutes
export const contactFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You have submitted several messages recently. Please wait a few minutes before sending another.' },
});

// Stricter limiter for AI Copilot chat: 20 queries per 5 minutes
export const copilotLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI Copilot rate limit reached. Please wait a moment before sending more questions.' },
});

// Limiter for Admin login attempts: 10 attempts per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
});
