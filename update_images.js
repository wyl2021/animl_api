const pool = require('./config/db');

async function updateCatImages() {
  try {
    // 更新猫咪图片
    await pool.execute('UPDATE cats SET image = ? WHERE id = ?', ['chongwu1.jpg', 1]);
    await pool.execute('UPDATE cats SET image = ? WHERE id = ?', ['chongwu2.jpg', 2]);
    await pool.execute('UPDATE cats SET image = ? WHERE id = ?', ['chongwu3.jpg', 3]);
    
    console.log('猫咪图片更新成功！');
    
    // 验证更新结果
    const [cats] = await pool.execute('SELECT id, name, image FROM cats');
    console.log('更新后的猫咪信息：');
    cats.forEach(cat => {
      console.log(`ID: ${cat.id}, 名称: ${cat.name}, 图片: ${cat.image}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('更新图片失败:', error.message);
    await pool.end();
  }
}

updateCatImages();