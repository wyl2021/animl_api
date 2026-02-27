const pool = require('../config/db');

// 创建猫咪
exports.createCat = async (req, res) => {
  try {
    const { name, breed, age, age_display, description, adoption_requirements } = req.body;
    const image = req.file ? req.file.filename : null;
    const user_id = req.user?.id || 1; // 默认使用ID为1的用户
    const [result] = await pool.execute(
      'INSERT INTO cats (name, breed, age, age_display, description, adoption_requirements, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, breed, age, age_display, description, adoption_requirements, image, user_id]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      breed,
      age,
      age_display,
      description,
      adoption_requirements,
      image,
      user_id,
      user_name: req.user?.name || '管理员'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取所有猫咪
exports.getCats = async (req, res) => {
  try {
    const { status, sort, page = 1, pageSize = 8 } = req.query;
    const userId = req.user?.id || null;

    // 先测试基本查询，不带分页和点赞验证
    let query = 'SELECT c.*, u.name as user_name FROM cats c LEFT JOIN users u ON c.user_id = u.id';
    let params = [];

    if (status) {
      query += ' WHERE c.adoption_status = ?';
      params.push(status);
    }

    if (sort === 'latest') {
      query += ' ORDER BY c.created_at DESC';
    } else if (sort === 'popular') {
      query += ' ORDER BY c.likes DESC, c.views DESC';
    } else {
      query += ' ORDER BY c.created_at DESC';
    }

    const [rows] = await pool.execute(query, params);

    // 为每个猫咪添加isLiked字段
    const catsWithLiked = rows.map(cat => ({
      ...cat,
      isLiked: false
    }));

    // 如果有用户登录，查询用户的点赞状态
    if (userId && catsWithLiked.length > 0) {
      try {
        // 获取用户的所有点赞记录
        const [likeResults] = await pool.execute('SELECT cat_id FROM cat_likes WHERE user_id = ?', [userId]);
        const likedCatIds = likeResults.map(item => item.cat_id);

        // 更新每个猫咪的isLiked状态
        catsWithLiked.forEach(cat => {
          cat.isLiked = likedCatIds.includes(cat.id);
        });
      } catch (error) {
        console.error('Error querying user likes:', error.message);
        // 发生错误时，保持isLiked为false
      }
    }

    res.status(200).json({
      items: catsWithLiked,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: rows.length,
        totalPages: Math.ceil(rows.length / parseInt(pageSize))
      }
    });
  } catch (error) {
    console.error('Error in getCats:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取单个猫咪
exports.getCatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    // 增加浏览量
    await pool.execute('UPDATE cats SET views = views + 1 WHERE id = ?', [id]);

    const [rows] = await pool.execute('SELECT c.*, u.name as user_name FROM cats c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const cat = rows[0];
    // 为猫咪添加isLiked字段
    cat.isLiked = false;

    // 如果有用户登录，查询用户的点赞状态
    if (userId) {
      try {
        const [likeResults] = await pool.execute('SELECT * FROM cat_likes WHERE user_id = ? AND cat_id = ?', [userId, id]);
        cat.isLiked = likeResults.length > 0;
      } catch (error) {
        console.error('Error querying cat like status:', error.message);
        // 发生错误时，保持isLiked为false
      }
    }

    res.status(200).json(cat);
  } catch (error) {
    console.error('Error in getCatById:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 获取热门猫咪
exports.getHotCats = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM cats WHERE adoption_status = ? ORDER BY likes DESC, views DESC LIMIT 10',
      ['available']
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取最新领养信息
exports.getLatestAdoption = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM cats WHERE adoption_status = ? ORDER BY created_at DESC LIMIT 10',
      ['available']
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新猫咪
exports.updateCat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, age, age_display, description, adoption_status, adoption_requirements, adoption_date, is_hot } = req.body || req.fields || {};
    const image = req.file ? req.file.filename : null;

    // 先获取当前猫咪信息
    const [currentCat] = await pool.execute('SELECT * FROM cats WHERE id = ?', [id]);
    if (currentCat.length === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    // 使用当前值作为默认值
    const cat = currentCat[0];
    const updateData = {
      name: name || cat.name,
      breed: breed || cat.breed,
      age: age || cat.age,
      age_display: age_display || cat.age_display,
      description: description || cat.description,
      adoption_status: adoption_status || cat.adoption_status,
      adoption_requirements: adoption_requirements || cat.adoption_requirements,
      adoption_date: adoption_date || cat.adoption_date,
      is_hot: is_hot !== undefined ? is_hot : cat.is_hot,
      image: image || cat.image
    };

    const query = 'UPDATE cats SET name = ?, breed = ?, age = ?, age_display = ?, description = ?, adoption_status = ?, adoption_requirements = ?, adoption_date = ?, is_hot = ?, image = ? WHERE id = ?';
    const params = [
      updateData.name, updateData.breed, updateData.age, updateData.age_display,
      updateData.description, updateData.adoption_status, updateData.adoption_requirements,
      updateData.adoption_date, updateData.is_hot, updateData.image, id
    ];

    const [result] = await pool.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const [updatedCat] = await pool.execute('SELECT * FROM cats WHERE id = ?', [id]);
    res.status(200).json(updatedCat[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除猫咪
exports.deleteCat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // 检查猫咪是否存在
    const [catRows] = await pool.execute('SELECT user_id FROM cats WHERE id = ?', [id]);
    if (catRows.length === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const catUserId = catRows[0].user_id;

    // 检查权限：只有创建人或者管理员可以删除
    if (userId !== catUserId && userRole !== 'admin') {
      return res.status(403).json({ error: '权限不足，只有创建人或管理员可以删除' });
    }

    const [result] = await pool.execute('DELETE FROM cats WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json({ message: 'Cat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 点赞猫咪
exports.likeCat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: '请登录' });
    }

    // 检查是否已经点赞
    const [existingLike] = await pool.execute('SELECT * FROM cat_likes WHERE user_id = ? AND cat_id = ?', [userId, id]);
    if (existingLike.length > 0) {
      const [cat] = await pool.execute('SELECT likes FROM cats WHERE id = ?', [id]);
      return res.status(200).json({ likes: cat[0].likes, isLiked: true });
    }

    // 添加点赞记录
    await pool.execute('INSERT INTO cat_likes (user_id, cat_id) VALUES (?, ?)', [userId, id]);
    // 更新猫咪点赞数
    await pool.execute('UPDATE cats SET likes = likes + 1 WHERE id = ?', [id]);

    const [cat] = await pool.execute('SELECT likes FROM cats WHERE id = ?', [id]);
    res.status(200).json({ likes: cat[0].likes, isLiked: true });
  } catch (error) {
    console.error('Error in likeCat:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 取消点赞猫咪
exports.unlikeCat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: '请登录' });
    }

    // 检查是否已经点赞
    const [existingLike] = await pool.execute('SELECT * FROM cat_likes WHERE user_id = ? AND cat_id = ?', [userId, id]);
    if (existingLike.length === 0) {
      const [cat] = await pool.execute('SELECT likes FROM cats WHERE id = ?', [id]);
      return res.status(200).json({ likes: cat[0].likes, isLiked: false });
    }

    // 删除点赞记录
    await pool.execute('DELETE FROM cat_likes WHERE user_id = ? AND cat_id = ?', [userId, id]);
    // 更新猫咪点赞数
    await pool.execute('UPDATE cats SET likes = GREATEST(likes - 1, 0) WHERE id = ?', [id]);

    const [cat] = await pool.execute('SELECT likes FROM cats WHERE id = ?', [id]);
    res.status(200).json({ likes: cat[0].likes, isLiked: false });
  } catch (error) {
    console.error('Error in unlikeCat:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 更新领养状态
exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;
    const [result] = await pool.execute(
      'UPDATE cats SET adoption_status = ?, adoption_date = ? WHERE id = ?',
      [status, date, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json({ message: 'Adoption status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
