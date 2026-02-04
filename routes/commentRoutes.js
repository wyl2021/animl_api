const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 评论相关路由
router.post('/comments', commentController.createComment);
router.get('/comments/post/:post_id', commentController.getCommentsByPostId);
router.put('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;
