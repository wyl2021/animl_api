const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

// 评论相关路由（全部需要token验证）
router.get('/comments/post/:post_id', authenticate, commentController.getCommentsByPostId);
router.get('/cats/:cat_id/comments', authenticate, commentController.getCommentsByCatId);
router.post('/comments', authenticate, commentController.createComment);
router.put('/comments/:id', authenticate, commentController.updateComment);
router.delete('/comments/:id', authenticate, commentController.deleteComment);
router.post('/comments/:id/like', authenticate, commentController.likeComment);
router.delete('/comments/:id/like', authenticate, commentController.unlikeComment);

module.exports = router;
