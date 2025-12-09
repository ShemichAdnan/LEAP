import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authGuard } from '../middlewares/auth.js';
import { avatarUpload } from '../middlewares/upload.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authGuard, authController.getMe);
router.put('/profile', authGuard, authController.updateProfile);
router.post('/avatar', authGuard, avatarUpload.single('avatar'), authController.uploadAvatar);
router.put('/change-password', authGuard, authController.changePassword);

export default router;
