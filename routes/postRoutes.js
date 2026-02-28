const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
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

// 帖子相关路由（全部需要token验证）
router.get('/posts', authenticate, postController.getPosts);
router.get('/posts/my', authenticate, postController.getMyPosts);
router.get('/posts/:id', authenticate, postController.getPostById);
router.get('/posts/:id/comments', authenticate, commentController.getCommentsByPostId);
router.post('/posts', authenticate, postController.createPost); // 用于处理没有文件上传的情况
router.post('/posts/image', authenticate, upload.single('image'), postController.createPost); // 用于处理有文件上传的情况
router.put('/posts/:id', authenticate, upload.single('image'), postController.updatePost);
router.put('/posts/:id/status', authenticate, postController.updatePostStatus);
router.delete('/posts/:id', authenticate, postController.deletePost);

module.exports = router;
