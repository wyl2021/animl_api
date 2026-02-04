const pool = require('../config/db');

// 创建帖子
exports.createPost = async (req, res) => {
  try {
    const { user_id, cat_id, title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'INSERT INTO posts (user_id, cat_id, title, content, image) VALUES (?, ?, ?, ?, ?)',
      [user_id, cat_id, title, content, image]
    );
    res.status(201).json({ 
      id: result.insertId, 
      user_id, 
      cat_id, 
      title, 
      content, 
      image 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子列表
exports.getPosts = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, u.name as user_name, c.name as cat_name, c.breed as cat_breed
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN cats c ON p.cat_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取帖子详情
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
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
    
    // 获取帖子的评论
    const [commentRows] = await pool.execute(`
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [id]);
    
    const post = postRows[0];
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
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
      [title, content, image, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ id, title, content, image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除帖子
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
