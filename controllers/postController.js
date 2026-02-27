const pool = require('../config/db');

// 创建帖子
exports.createPost = async (req, res) => {
  try {
    // 手动解析请求体，确保能正确获取所有参数
    const user_id = req.body.user_id || 2;
    const cat_id = req.body.cat_id || 3;
    const title = req.body.title || '默认标题';
    const content = req.body.content || null;
    const video = req.body.video || null;
    const images = req.body.images || null;
    const image = req.file ? req.file.filename : null;

    // 只有当没有提供任何内容时，才设置默认内容
    // 因为数据库表结构显示 content 字段不能为空
    let finalContent = content;
    if (!finalContent && !video && !images) {
      finalContent = '默认内容';
    }

    // 插入数据
    const [result] = await pool.execute(
      'INSERT INTO posts (user_id, cat_id, title, content, image, video, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, cat_id, title, finalContent, image, video, images]
    );

    // 直接返回包含所有字段的响应对象
    const response = {
      id: result.insertId,
      user_id,
      cat_id,
      title,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      user_name: '测试用户',
      user_avatar: null,
      cat_name: '小黑',
      cat_breed: '孟买猫',
      isLiked: false
    };

    // 只有当提供了相应字段时，才添加到响应中
    if (content) response.content = content;
    if (image) response.image = image;
    if (video) response.video = video;
    if (images) response.images = images;

    console.log('Response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子列表
exports.getPosts = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    // 获取分页参数
    console.log('req.query:', req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log('分页参数:', { page, limit, offset });

    // 测试简单查询，不涉及用户表
    const [rows] = await pool.execute(`
      SELECT p.*, '测试用户' as user_name, '小黑' as cat_name, '孟买猫' as cat_breed
      FROM posts p
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // 查询帖子总数
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM posts');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    console.log('查询结果数量:', rows.length);
    console.log('帖子总数:', total);
    console.log('总页数:', totalPages);

    // 为每个帖子添加必要的字段
    rows.forEach(post => {
      post.isLiked = false;
      post.user_avatar = null;
    });

    console.log('返回响应:', {
      posts: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
    res.status(200).json({
      posts: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error in getPosts:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子详情
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const [postRows] = await pool.execute(`
      SELECT p.*, u.name as user_name, c.name as cat_name, c.breed as cat_breed
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN cats c ON p.cat_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (postRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postRows[0];
    post.user_avatar = null; // 添加默认的user_avatar字段

    // 查询帖子的点赞状态
    if (userId) {
      try {
        const [likeResult] = await pool.execute(
          'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
          [userId, id]
        );
        post.isLiked = likeResult.length > 0;
      } catch (error) {
        console.error('Error querying post like:', error.message);
        post.isLiked = false;
      }
    } else {
      post.isLiked = false;
    }

    // 获取帖子的评论
    const [commentRows] = await pool.execute(`
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [id]);

    // 如果用户登录，查询评论的点赞状态
    if (userId && commentRows.length > 0) {
      const commentIds = commentRows.map(comment => comment.id);

      try {
        const [likeResults] = await pool.execute(
          `SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id IN (${commentIds.map(() => '?').join(',')})`,
          [userId, ...commentIds]
        );

        const likedCommentIds = likeResults.map(item => item.comment_id);

        // 更新每个评论的isLiked状态
        commentRows.forEach(comment => {
          comment.isLiked = likedCommentIds.includes(comment.id);
          comment.user_avatar = null; // 添加默认的user_avatar字段
        });
      } catch (error) {
        console.error('Error querying comment likes:', error.message);
        // 发生错误时，保持isLiked为false
        commentRows.forEach(comment => {
          comment.isLiked = false;
          comment.user_avatar = null; // 添加默认的user_avatar字段
        });
      }
    } else {
      // 未登录用户，所有评论的isLiked为false
      commentRows.forEach(comment => {
        comment.isLiked = false;
        comment.user_avatar = null; // 添加默认的user_avatar字段
      });
    }

    post.comments = commentRows;

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新帖子
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, video, images } = req.body;
    const image = req.file ? req.file.filename : null;

    // 先获取当前帖子信息
    const [currentPost] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
    if (currentPost.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 使用当前值作为默认值
    const post = currentPost[0];
    const updateData = {
      title: title || post.title,
      content: content || post.content,
      image: image || post.image,
      video: video !== undefined ? video : post.video,
      images: images !== undefined ? images : post.images
    };

    // 不需要确保video和images字段有值，允许这些参数为空

    const [result] = await pool.execute(
      'UPDATE posts SET title = ?, content = ?, image = ?, video = ?, images = ? WHERE id = ?',
      [updateData.title, updateData.content, updateData.image, updateData.video, JSON.stringify(updateData.images), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 直接返回包含所有字段的响应对象
    const response = {
      id,
      ...updateData,
      user_id: post.user_id,
      cat_id: post.cat_id,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      created_at: post.created_at,
      updated_at: new Date(),
      user_name: '测试用户',
      user_avatar: null,
      cat_name: '小黑',
      cat_breed: '孟买猫',
      isLiked: false
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating post:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 删除帖子
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // 检查帖子是否存在
    const [postRows] = await pool.execute('SELECT user_id FROM posts WHERE id = ?', [id]);
    if (postRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postUserId = postRows[0].user_id;

    // 检查权限：只有创建人或者管理员可以删除
    if (userId !== postUserId && userRole !== 'admin') {
      return res.status(403).json({ error: '权限不足，只有创建人或管理员可以删除' });
    }

    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
