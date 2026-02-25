const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/authMiddleware');

// 点赞相关路由（需要token验证）
router.post('/likes', authenticate, likeController.likePost);
router.delete('/likes', authenticate, likeController.unlikePost);
router.get('/likes/check', authenticate, likeController.checkLike);

module.exports = router;
