const pool = require('../config/db');

async function fixData() {
  try {
    // 更新用户表数据
    await pool.execute(
      'UPDATE users SET name = ? WHERE name = ?',
      ['张三', '????']
    );
    console.log('Updated user name');

    // 更新猫咪表数据
    const [cats] = await pool.execute('SELECT id FROM cats WHERE name LIKE ? OR breed LIKE ? OR description LIKE ?', ['%?%', '%?%', '%?%']);
    
    const catNames = ['小白', '小黑', '小花', '咪咪', '毛毛', '球球', '豆豆', '奶茶', '布丁', '可乐', '雪球', '小虎', '乖乖', '皮皮'];
    const catDescriptions = [
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
    
    for (let i = 0; i < cats.length; i++) {
      const cat = cats[i];
      const name = catNames[i % catNames.length];
      const description = catDescriptions[i % catDescriptions.length];
      
      await pool.execute(
        'UPDATE cats SET name = ?, description = ? WHERE id = ?',
        [name, description, cat.id]
      );
    }
    console.log('Updated cat data');

    // 更新帖子表数据
    const [posts] = await pool.execute('SELECT id FROM posts WHERE title LIKE ? OR content LIKE ?', ['%?%', '%?%']);
    
    const postTitles = [
      '我家猫咪的趣事',
      '猫咪的日常',
      '猫咪的搞笑瞬间',
      '猫咪的成长记录',
      '猫咪的可爱瞬间'
    ];
    
    const postContents = [
      '今天我家猫咪居然学会了开抽屉，太聪明了！',
      '我家猫咪今天做了一件很有趣的事情，它居然把我的袜子藏到了沙发下面。',
      '猫咪的睡姿真是太可爱了，每次看到它睡觉我都忍不住想拍照。',
      '猫咪今天第一次尝试爬猫爬架，虽然有点笨拙，但是很努力。',
      '猫咪今天第一次看到外面的雪，它的表情真是太有趣了。'
    ];
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const title = postTitles[i % postTitles.length];
      const content = postContents[i % postContents.length];
      
      await pool.execute(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, post.id]
      );
    }
    console.log('Updated post data');

    // 更新评论表数据
    const [comments] = await pool.execute('SELECT id FROM comments WHERE content LIKE ?', ['%?%']);
    
    const commentContents = [
      '太有趣了，我家猫咪也很聪明！',
      '太可爱了，我也想养一只！',
      '哈哈，我家猫咪也是这样！',
      '这个猫咪真是太可爱了！',
      '我也遇到过这种情况！'
    ];
    
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const content = commentContents[i % commentContents.length];
      
      await pool.execute(
        'UPDATE comments SET content = ? WHERE id = ?',
        [content, comment.id]
      );
    }
    console.log('Updated comment data');

    console.log('All data has been fixed successfully');
    
    // 关闭数据库连接
    await pool.end();
  } catch (error) {
    console.error('Error fixing data:', error.message);
  }
}

// 执行数据修复
fixData();
