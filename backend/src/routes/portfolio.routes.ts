import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.use(apiLimiter);

router.get('/', portfolioController.getFullPortfolio.bind(portfolioController));
router.get('/skills', portfolioController.getSkills.bind(portfolioController));
router.get('/experiences', portfolioController.getExperiences.bind(portfolioController));
router.get('/projects', portfolioController.getProjects.bind(portfolioController));
router.get('/education', portfolioController.getEducation.bind(portfolioController));

export default router;
