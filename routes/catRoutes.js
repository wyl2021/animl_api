const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 公开路由（不需要token验证）
router.get('/cats/public/hot', catController.getHotCats);
router.get('/cats/public/latest', catController.getLatestAdoption);
router.get('/cats/public/:id', catController.getCatById);

// 需要token验证的路由
router.get('/cats', authenticate, catController.getCats);
router.get('/cats/my', authenticate, catController.getMyCats);
router.get('/cats/:id', authenticate, catController.getCatById);
router.post('/cats', authenticate, upload.single('image'), catController.createCat);
router.put('/cats/:id', authenticate, upload.single('image'), catController.updateCat);
router.delete('/cats/:id', authenticate, catController.deleteCat);
router.post('/cats/:id/like', authenticate, catController.likeCat);
router.delete('/cats/:id/like', authenticate, catController.unlikeCat);
router.put('/cats/:id/adoption', authenticate, catController.updateAdoptionStatus);
router.put('/cats/:id/status', authenticate, catController.updateCatStatus);

module.exports = router;
