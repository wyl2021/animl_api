const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// 点赞相关路由
router.post('/likes', likeController.likePost);
router.delete('/likes', likeController.unlikePost);
router.get('/likes/check', likeController.checkLike);

module.exports = router;
