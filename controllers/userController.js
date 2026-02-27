const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { name, account, password } = req.body;

    if (!name || !account || !password) {
      return res.status(400).json({ error: '请输入姓名、账号和密码' });
    }

    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE account = ?',
      [account]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '账号已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user'; // 默认角色为普通用户

    const [result] = await pool.execute(
      'INSERT INTO users (name, account, password, role) VALUES (?, ?, ?, ?)',
      [name, account, hashedPassword, role]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    res.status(201).json({
      id: userId,
      name,
      account,
      role,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ error: 'Account and password are required' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, account, password, role, avatar FROM users WHERE account = ?',
      [account]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid account or password' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid account or password' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      id: user.id,
      name: user.name,
      account: user.account,
      role: user.role,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 创建用户（保持向后兼容）
exports.createUser = async (req, res) => {
  try {
    const { name, account, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user'; // 默认角色为普通用户
    const [result] = await pool.execute(
      'INSERT INTO users (name, account, password, role) VALUES (?, ?, ?, ?)',
      [name, account, hashedPassword, role]
    );
    res.status(201).json({ id: result.insertId, name, account, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取所有用户
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, account, role, avatar, created_at FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个用户
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, name, account, role, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, account, password, avatar } = req.body;

    // 检查用户是否存在
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 准备更新数据
    let updateData = {};
    if (name) updateData.name = name;
    if (account) updateData.account = account;
    if (avatar) updateData.avatar = avatar;
    if (req.file) updateData.avatar = req.file.filename;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // 构建更新语句
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 查询更新后的数据
    const [updatedUsers] = await pool.execute('SELECT id, name, account, role, avatar FROM users WHERE id = ?', [id]);
    res.status(200).json(updatedUsers[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取当前用户信息
exports.getUserInfo = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const userId = req.user?.id;
    console.log('userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: '请登录' });
    }
    
    const [rows] = await pool.execute('SELECT id, name, account, role, avatar, created_at FROM users WHERE id = ?', [userId]);
    console.log('rows:', rows);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    res.status(500).json({ error: error.message });
  }
};
