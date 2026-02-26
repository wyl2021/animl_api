const express = require('express');
const router = express.Router();
const encyclopediaController = require('../controllers/encyclopediaController');
const { authenticate } = require('../middleware/authMiddleware');

// 猫咪百科相关路由（全部需要token验证）
router.post('/encyclopedias', authenticate, encyclopediaController.createEncyclopedia);
router.delete('/encyclopedias/:id', authenticate, encyclopediaController.deleteEncyclopedia);
router.put('/encyclopedias/:id', authenticate, encyclopediaController.updateEncyclopedia);
router.get('/encyclopedias', authenticate, encyclopediaController.getEncyclopedias);
router.get('/encyclopedias/:id', authenticate, encyclopediaController.getEncyclopediaById);

module.exports = router;
