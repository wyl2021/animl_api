const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '请登录' });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, JWT_SECRET);

        const [rows] = await pool.execute(
            'SELECT id, name, account, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: '请登录' });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: '请登录' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: '请登录' });
        }
        res.status(500).json({ error: error.message });
    }
};

// 检查用户是否为超级管理员
exports.authorizeAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: '权限不足' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
