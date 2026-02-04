const pool = require('../config/db');

// 给帖子点赞
exports.likePost = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;
    
    // 开启事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 检查是否已经点赞
      const [existingLike] = await connection.execute(
        'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
        [user_id, post_id]
      );
      
      if (existingLike.length > 0) {
        await connection.release();
        return res.status(400).json({ error: 'Already liked' });
      }
      
      // 添加点赞记录
      await connection.execute(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [user_id, post_id]
      );
      
      // 更新帖子的点赞数
      await connection.execute(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
        [post_id]
      );
      
      // 提交事务
      await connection.commit();
      await connection.release();
      
      res.status(200).json({ message: 'Liked successfully' });
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

// 取消点赞
exports.unlikePost = async (req, res) => {
  try {
    const { user_id, post_id } = req.body;
    
    // 开启事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 检查是否已经点赞
      const [existingLike] = await connection.execute(
        'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
        [user_id, post_id]
      );
      
      if (existingLike.length === 0) {
        await connection.release();
        return res.status(400).json({ error: 'Not liked yet' });
      }
      
      // 删除点赞记录
      await connection.execute(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [user_id, post_id]
      );
      
      // 更新帖子的点赞数
      await connection.execute(
        'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ? AND likes_count > 0',
        [post_id]
      );
      
      // 提交事务
      await connection.commit();
      await connection.release();
      
      res.status(200).json({ message: 'Unliked successfully' });
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

// 检查用户是否已点赞
exports.checkLike = async (req, res) => {
  try {
    const { user_id, post_id } = req.query;
    
    const [result] = await pool.execute(
      'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
      [user_id, post_id]
    );
    
    res.status(200).json({ liked: result.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
