const express = require('express');
const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 测试路由
app.get('/api/posts/:id/comments', (req, res) => {
  console.log('收到帖子评论请求，帖子ID:', req.params.id);
  res.json({ message: '获取帖子评论成功', post_id: req.params.id });
});

// 健康检查
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});