import express from 'express';
import { registerUser, authUser, createUserPrivileged, getUsers, getUserById, updateUser } from '../controllers/authController.js';
import { protect, admin, superadmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/create-user', protect, admin, createUserPrivileged);
router.get('/users', protect, superadmin, getUsers);
router.get('/users/:id', protect, superadmin, getUserById);
router.put('/users/:id', protect, superadmin, updateUser);

export default router;
