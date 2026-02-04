const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');
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

// 猫咪相关路由
router.post('/cats', upload.single('image'), catController.createCat);
router.get('/cats', catController.getCats);
router.get('/cats/:id', catController.getCatById);
router.put('/cats/:id', upload.single('image'), catController.updateCat);
router.delete('/cats/:id', catController.deleteCat);

module.exports = router;
