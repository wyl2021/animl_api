const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// 用户认证路由（不需要token）
router.post('/register', userController.register);
router.post('/login', userController.login);

// 用户相关路由（需要token验证）
router.post('/users', authenticate, userController.createUser);
router.get('/users', authenticate, userController.getUsers);
router.get('/users/:id', authenticate, userController.getUserById);
router.put('/users/:id', authenticate, userController.updateUser);
router.delete('/users/:id', authenticate, userController.deleteUser);

module.exports = router;
