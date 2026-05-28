const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
const { getUsers, getProfile, createUser, updateUser, deleteUser, getDashboardStats } = require('../controllers/usersController');

// Profile route (any authenticated user)
router.get('/profile', authMiddleware, getProfile);

// Dashboard stats (any authenticated user)
router.get('/stats', authMiddleware, getDashboardStats);

// Users CRUD
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, roleMiddleware('admin'), createUser);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
