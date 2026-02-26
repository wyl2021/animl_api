const pool = require('../config/db');

// 增加猫咪百科
exports.createEncyclopedia = async (req, res) => {
  try {
    const {
      scientific_name,
      breed,
      characteristics,
      habits,
      care_guide,
      behavior_analysis,
      fun_facts,
      images,
      rarity
    } = req.body;

    // 插入数据
    const [result] = await pool.execute(
      'INSERT INTO cat_encyclopedias (scientific_name, breed, characteristics, habits, care_guide, behavior_analysis, fun_facts, images, rarity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [scientific_name, breed, characteristics, habits, care_guide, behavior_analysis, fun_facts, images || null, rarity]
    );

    // 查询刚插入的数据
    const [rows] = await pool.execute('SELECT * FROM cat_encyclopedias WHERE id = ?', [result.insertId]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating encyclopedia:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 删除猫咪百科
exports.deleteEncyclopedia = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查数据是否存在
    const [rows] = await pool.execute('SELECT * FROM cat_encyclopedias WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Encyclopedia not found' });
    }

    // 删除数据
    await pool.execute('DELETE FROM cat_encyclopedias WHERE id = ?', [id]);

    res.status(200).json({ message: 'Encyclopedia deleted successfully' });
  } catch (error) {
    console.error('Error deleting encyclopedia:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 修改猫咪百科
exports.updateEncyclopedia = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      scientific_name,
      breed,
      characteristics,
      habits,
      care_guide,
      behavior_analysis,
      fun_facts,
      images,
      rarity
    } = req.body;

    // 检查数据是否存在
    const [rows] = await pool.execute('SELECT * FROM cat_encyclopedias WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Encyclopedia not found' });
    }

    // 更新数据
    await pool.execute(
      'UPDATE cat_encyclopedias SET scientific_name = ?, breed = ?, characteristics = ?, habits = ?, care_guide = ?, behavior_analysis = ?, fun_facts = ?, images = ?, rarity = ? WHERE id = ?',
      [scientific_name, breed, characteristics, habits, care_guide, behavior_analysis, fun_facts, images || null, rarity, id]
    );

    // 查询更新后的数据
    const [updatedRows] = await pool.execute('SELECT * FROM cat_encyclopedias WHERE id = ?', [id]);

    res.status(200).json(updatedRows[0]);
  } catch (error) {
    console.error('Error updating encyclopedia:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 查询猫咪百科列表，包括分页和品种名筛选
exports.getEncyclopedias = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 获取品种名筛选参数
    const breed = req.query.breed;

    // 构建SQL查询
    let query = 'SELECT * FROM cat_encyclopedias';
    let countQuery = 'SELECT COUNT(*) as total FROM cat_encyclopedias';

    // 如果提供了品种名，添加筛选条件
    if (breed) {
      query += ` WHERE breed LIKE '%${breed}%'`;
      countQuery += ` WHERE breed LIKE '%${breed}%'`;
    }

    // 添加排序和分页
    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // 执行查询
    console.log('query:', query);
    console.log('countQuery:', countQuery);
    const [rows] = await pool.execute(query);
    console.log('rows:', rows);

    // 执行总数查询
    const [countResult] = await pool.execute(countQuery);
    console.log('countResult:', countResult);
    let total = 0;
    if (countResult && countResult[0]) {
      total = countResult[0].total;
    }
    const totalPages = Math.ceil(total / limit);
    console.log('total:', total);
    console.log('totalPages:', totalPages);

    res.status(200).json({
      encyclopedias: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting encyclopedias:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 根据ID查询猫咪百科详情
exports.getEncyclopediaById = async (req, res) => {
  try {
    const { id } = req.params;

    // 查询数据
    const [rows] = await pool.execute('SELECT * FROM cat_encyclopedias WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Encyclopedia not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error getting encyclopedia by id:', error.message);
    res.status(500).json({ error: error.message });
  }
};
