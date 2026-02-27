const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 用户认证路由（不需要token）
router.post('/register', userController.register);
router.post('/login', userController.login);

// 用户相关路由（需要token验证）
router.post('/users', authenticate, userController.createUser);
router.get('/users', authenticate, userController.getUsers);

// 获取当前用户信息（需要token验证）
router.get('/users/info', authenticate, userController.getUserInfo);

// 获取单个用户和其他操作
router.get('/users/:id', authenticate, userController.getUserById);
router.put('/users/:id', authenticate, userController.updateUser);
router.put('/users/:id/image', authenticate, upload.single('avatar'), userController.updateUser);
router.delete('/users/:id', authenticate, userController.deleteUser);

module.exports = router;
