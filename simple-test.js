const http = require('http');
const url = require('url');

const PORT = 3002;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

  // 处理帖子评论请求
  if (req.method === 'GET' && pathname.match(/^\/api\/posts\/(\d+)\/comments$/)) {
    const postId = pathname.match(/^\/api\/posts\/(\d+)\/comments$/)[1];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '获取帖子评论成功', post_id: postId }));
    return;
  }

  // 处理健康检查
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Simple test server is running' }));
    return;
  }

  // 处理404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`Simple test server is running on port ${PORT}`);
});

// 保持服务器运行
process.on('SIGINT', () => {
  console.log('关闭服务器');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});