const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// 猫咪品种列表
const breeds = ['英短', '美短', '布偶', '暹罗', '橘猫', '波斯猫', '缅因猫', '斯芬克斯', '加菲猫', '金吉拉'];

// 猫咪描述模板
const descriptions = [
  '一只可爱的猫咪，性格温顺，喜欢撒娇。',
  '活泼好动的猫咪，喜欢玩逗猫棒。',
  '安静的猫咪，喜欢晒太阳和睡觉。',
  '聪明的猫咪，会自己开门和玩玩具。',
  '粘人的猫咪，喜欢和主人一起玩耍。',
  '独立的猫咪，有自己的想法和个性。',
  '友善的猫咪，对陌生人也很友好。',
  '警惕的猫咪，对周围环境很敏感。',
  '贪吃的猫咪，看到食物就走不动路。',
  '爱干净的猫咪，总是把自己舔得很干净。'
];

// 生成随机年龄（1-10岁）
function getRandomAge() {
  return Math.floor(Math.random() * 10) + 1;
}

// 生成随机品种
function getRandomBreed() {
  return breeds[Math.floor(Math.random() * breeds.length)];
}

// 生成随机描述
function getRandomDescription() {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// 生成测试数据
async function seedData() {
  try {
    // 读取uploads目录中的图片文件
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir);
    
    // 过滤出jpg和png图片
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.png';
    });
    
    console.log(`Found ${images.length} images in uploads directory`);
    
    // 为每个图片生成猫咪数据
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const name = `猫咪${i + 1}`;
      const breed = getRandomBreed();
      const age = getRandomAge();
      const description = getRandomDescription();
      
      // 插入数据到数据库
      const [result] = await pool.execute(
        'INSERT INTO cats (name, breed, age, description, image) VALUES (?, ?, ?, ?, ?)',
        [name, breed, age, description, image]
      );
      
      console.log(`Created cat ${name} with id ${result.insertId}`);
    }
    
    console.log('Seed data generated successfully');
    
    // 关闭数据库连接
    await pool.end();
  } catch (error) {
    console.error('Error generating seed data:', error.message);
  }
}

// 执行种子数据生成
seedData();
