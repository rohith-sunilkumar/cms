import express from 'express';
import { registerUser, authUser, createUserPrivileged } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/create-user', protect, admin, createUserPrivileged);

export default router;
