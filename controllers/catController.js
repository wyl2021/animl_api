const pool = require('../config/db');

// 创建猫咪
exports.createCat = async (req, res) => {
  try {
    const { name, breed, age, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'INSERT INTO cats (name, breed, age, description, image) VALUES (?, ?, ?, ?, ?)',
      [name, breed, age, description, image]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      breed, 
      age, 
      description, 
      image 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取所有猫咪
exports.getCats = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM cats');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个猫咪
exports.getCatById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM cats WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新猫咪
exports.updateCat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, age, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const [result] = await pool.execute(
      'UPDATE cats SET name = ?, breed = ?, age = ?, description = ?, image = ? WHERE id = ?',
      [name, breed, age, description, image, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json({ 
      id, 
      name, 
      breed, 
      age, 
      description, 
      image 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除猫咪
exports.deleteCat = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM cats WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.status(200).json({ message: 'Cat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
