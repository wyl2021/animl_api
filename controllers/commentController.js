const pool = require('../config/db');

// 创建评论
exports.createComment = async (req, res) => {
  try {
    const { user_id, post_id, content } = req.body;
    
    // 开启事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 添加评论记录
      const [result] = await connection.execute(
        'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
        [user_id, post_id, content]
      );
      
      // 更新帖子的评论数
      await connection.execute(
        'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
        [post_id]
      );
      
      // 提交事务
      await connection.commit();
      await connection.release();
      
      res.status(201).json({ 
        id: result.insertId, 
        user_id, 
        post_id, 
        content 
      });
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      await connection.release();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子的评论列表
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { post_id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [post_id]);
    
    res.status(200).json(rows);
  } catch (error) {
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
      // 获取评论信息（用于更新帖子的评论数）
      const [commentInfo] = await connection.execute(
        'SELECT post_id FROM comments WHERE id = ?',
        [id]
      );
      
      if (commentInfo.length === 0) {
        await connection.release();
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      const post_id = commentInfo[0].post_id;
      
      // 删除评论记录
      await connection.execute(
        'DELETE FROM comments WHERE id = ?',
        [id]
      );
      
      // 更新帖子的评论数
      await connection.execute(
        'UPDATE posts SET comments_count = comments_count - 1 WHERE id = ? AND comments_count > 0',
        [post_id]
      );
      
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
    res.status(500).json({ error: error.message });
  }
};
