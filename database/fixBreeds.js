const pool = require('../config/db');

async function fixBreeds() {
  try {
    // 获取所有猫咪数据
    const [cats] = await pool.execute('SELECT id, breed FROM cats');
    
    // 品种映射
    const breedMap = {
      '??': '英短'
    };
    
    // 更新有问题的品种
    for (const cat of cats) {
      if (breedMap[cat.breed]) {
        await pool.execute(
          'UPDATE cats SET breed = ? WHERE id = ?',
          [breedMap[cat.breed], cat.id]
        );
        console.log(`Updated cat ${cat.id} breed from ${cat.breed} to ${breedMap[cat.breed]}`);
      }
    }
    
    console.log('All breeds have been fixed successfully');
    
    // 关闭数据库连接
    await pool.end();
  } catch (error) {
    console.error('Error fixing breeds:', error.message);
  }
}

// 执行品种修复
fixBreeds();
