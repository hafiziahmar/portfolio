import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Protect all admin routes with JWT
router.use(requireAuth as any);

// Profile
router.put('/profile', adminController.updateProfile.bind(adminController));

// Skills
router.post('/skills', adminController.createSkill.bind(adminController));
router.put('/skills/:id', adminController.updateSkill.bind(adminController));
router.delete('/skills/:id', adminController.deleteSkill.bind(adminController));

// Experiences
router.post('/experiences', adminController.createExperience.bind(adminController));
router.put('/experiences/:id', adminController.updateExperience.bind(adminController));
router.delete('/experiences/:id', adminController.deleteExperience.bind(adminController));

// Projects
router.post('/projects', adminController.createProject.bind(adminController));
router.put('/projects/:id', adminController.updateProject.bind(adminController));
router.delete('/projects/:id', adminController.deleteProject.bind(adminController));

// Messages Queue
router.get('/messages', adminController.getMessages.bind(adminController));
router.patch('/messages/:id/status', adminController.updateMessageStatus.bind(adminController));
router.delete('/messages/:id', adminController.deleteMessage.bind(adminController));

// Cache Management
router.post('/cache/flush', adminController.flushCache.bind(adminController));

export default router;
