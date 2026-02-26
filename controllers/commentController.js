const pool = require('../config/db');

// 创建评论
exports.createComment = async (req, res) => {
  try {
    // 从req.user获取用户ID
    const user_id = req.user?.id || req.user?.userId;

    // 验证用户ID
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // 获取请求参数
    let { post_id, cat_id, parent_id, content } = req.body;

    // 验证内容
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // 验证目标（猫咪或帖子）
    if (!post_id && !cat_id) {
      return res.status(400).json({ error: 'Either post_id or cat_id is required' });
    }

    // 处理null值
    post_id = post_id || null;
    cat_id = cat_id || null;
    parent_id = parent_id || null;

    try {
      // 添加评论记录
      const [result] = await pool.execute(
        'INSERT INTO comments (user_id, post_id, cat_id, parent_id, content) VALUES (?, ?, ?, ?, ?)',
        [user_id, post_id, cat_id, parent_id, content]
      );

      // 更新对应内容的评论数
      if (post_id) {
        await pool.execute(
          'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
          [post_id]
        );
      }

      // 获取完整的评论信息（包括用户信息）
      const [newComment] = await pool.execute(
        'SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
        [result.insertId]
      );

      res.status(201).json({
        ...newComment[0],
        isLiked: false
      });
    } catch (error) {
      console.error('Error executing SQL:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子的评论列表
exports.getCommentsByPostId = async (req, res) => {
  try {
    // 支持从post_id或id参数获取帖子ID
    const postId = req.params.post_id || req.params.id;
    const userId = req.user?.id || null;

    let query = `
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `;

    const [rows] = await pool.execute(query, [postId]);

    // 如果用户登录，查询评论的点赞状态
    if (userId && rows.length > 0) {
      const commentIds = rows.map(comment => comment.id);

      try {
        const [likeResults] = await pool.execute(
          `SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id IN (${commentIds.map(() => '?').join(',')})`,
          [userId, ...commentIds]
        );

        const likedCommentIds = likeResults.map(item => item.comment_id);

        // 更新每个评论的isLiked状态
        rows.forEach(comment => {
          comment.isLiked = likedCommentIds.includes(comment.id);
        });
      } catch (error) {
        console.error('Error querying comment likes:', error.message);
        // 发生错误时，保持isLiked为false
        rows.forEach(comment => {
          comment.isLiked = false;
        });
      }
    } else {
      // 未登录用户，所有评论的isLiked为false
      rows.forEach(comment => {
        comment.isLiked = false;
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting post comments:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取猫咪的评论列表
exports.getCommentsByCatId = async (req, res) => {
  try {
    const { cat_id } = req.params;
    const userId = req.user?.id || null;

    let query = `
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.cat_id = ?
      ORDER BY c.created_at DESC
    `;

    const [rows] = await pool.execute(query, [cat_id]);

    // 如果用户登录，查询评论的点赞状态
    if (userId && rows.length > 0) {
      const commentIds = rows.map(comment => comment.id);

      try {
        const [likeResults] = await pool.execute(
          `SELECT comment_id FROM comment_likes WHERE user_id = ? AND comment_id IN (${commentIds.map(() => '?').join(',')})`,
          [userId, ...commentIds]
        );

        const likedCommentIds = likeResults.map(item => item.comment_id);

        // 更新每个评论的isLiked状态
        rows.forEach(comment => {
          comment.isLiked = likedCommentIds.includes(comment.id);
        });
      } catch (error) {
        console.error('Error querying comment likes:', error.message);
        // 发生错误时，保持isLiked为false
        rows.forEach(comment => {
          comment.isLiked = false;
        });
      }
    } else {
      // 未登录用户，所有评论的isLiked为false
      rows.forEach(comment => {
        comment.isLiked = false;
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting cat comments:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 更新评论
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const [result] = await pool.execute(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ id, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // 开启事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 获取评论信息（用于更新评论数）
      const [commentInfo] = await connection.execute(
        'SELECT post_id, cat_id FROM comments WHERE id = ?',
        [id]
      );

      if (commentInfo.length === 0) {
        await connection.release();
        return res.status(404).json({ error: 'Comment not found' });
      }

      const { post_id, cat_id } = commentInfo[0];

      // 删除评论记录
      await connection.execute(
        'DELETE FROM comments WHERE id = ?',
        [id]
      );

      // 更新对应内容的评论数
      if (post_id) {
        await connection.execute(
          'UPDATE posts SET comments_count = comments_count - 1 WHERE id = ? AND comments_count > 0',
          [post_id]
        );
      }

      // 提交事务
      await connection.commit();
      await connection.release();

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      await connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 点赞评论
exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || req.user?.userId;

    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      // 检查是否已经点赞
      const [existingLike] = await pool.execute(
        'SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?',
        [user_id, id]
      );

      if (existingLike.length > 0) {
        // 已经点赞，返回当前状态
        const [comment] = await pool.execute(
          'SELECT likes_count FROM comments WHERE id = ?',
          [id]
        );
        return res.status(200).json({
          likes_count: comment[0].likes_count,
          isLiked: true
        });
      }

      // 开始事务
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 添加点赞记录
        await connection.execute(
          'INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)',
          [user_id, id]
        );

        // 更新评论的点赞数
        await connection.execute(
          'UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?',
          [id]
        );

        // 获取更新后的点赞数
        const [comment] = await connection.execute(
          'SELECT likes_count FROM comments WHERE id = ?',
          [id]
        );

        // 提交事务
        await connection.commit();
        await connection.release();

        res.status(200).json({
          likes_count: comment[0].likes_count,
          isLiked: true
        });
      } catch (error) {
        await connection.rollback();
        await connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error liking comment:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in likeComment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 取消点赞评论
exports.unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || req.user?.userId;

    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      // 检查是否已经点赞
      const [existingLike] = await pool.execute(
        'SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?',
        [user_id, id]
      );

      if (existingLike.length === 0) {
        // 未点赞，返回当前状态
        const [comment] = await pool.execute(
          'SELECT likes_count FROM comments WHERE id = ?',
          [id]
        );
        return res.status(200).json({
          likes_count: comment[0].likes_count,
          isLiked: false
        });
      }

      // 开始事务
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 删除点赞记录
        await connection.execute(
          'DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?',
          [user_id, id]
        );

        // 更新评论的点赞数
        await connection.execute(
          'UPDATE comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
          [id]
        );

        // 获取更新后的点赞数
        const [comment] = await connection.execute(
          'SELECT likes_count FROM comments WHERE id = ?',
          [id]
        );

        // 提交事务
        await connection.commit();
        await connection.release();

        res.status(200).json({
          likes_count: comment[0].likes_count,
          isLiked: false
        });
      } catch (error) {
        await connection.rollback();
        await connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error unliking comment:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in unlikeComment:', error.message);
    res.status(500).json({ error: error.message });
  }
};
