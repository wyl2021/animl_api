const express = require('express');
const router = express.Router();
const encyclopediaController = require('../controllers/encyclopediaController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
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

// 猫咪百科相关路由
// 需要超级管理员权限的路由
router.post('/encyclopedias', authenticate, authorizeAdmin, encyclopediaController.createEncyclopedia);
router.post('/encyclopedias/image', authenticate, authorizeAdmin, upload.single('image'), encyclopediaController.createEncyclopedia); // 用于处理有文件上传的情况
router.delete('/encyclopedias/:id', authenticate, authorizeAdmin, encyclopediaController.deleteEncyclopedia);
router.put('/encyclopedias/:id', authenticate, authorizeAdmin, upload.single('image'), encyclopediaController.updateEncyclopedia); // 用于处理有文件上传的情况

// 普通用户可以访问的路由
router.get('/encyclopedias', authenticate, encyclopediaController.getEncyclopedias);
router.get('/encyclopedias/:id', authenticate, encyclopediaController.getEncyclopediaById);

module.exports = router;
