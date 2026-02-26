const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    // 首先连接到MySQL服务器（不指定数据库）
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS animal_api');
    console.log('Database created or already exists');

    // 关闭连接
    await connection.end();

    // 重新连接到指定数据库
    const connectionWithDB = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'animal_api'
    });

    // 先删除旧表（按照依赖顺序）
    try {
      await connectionWithDB.query('DROP TABLE IF EXISTS comments');
      await connectionWithDB.query('DROP TABLE IF EXISTS likes');
      await connectionWithDB.query('DROP TABLE IF EXISTS posts');
      await connectionWithDB.query('DROP TABLE IF EXISTS cats');
      console.log('Old tables dropped successfully');
    } catch (error) {
      console.log('No old tables to drop or error dropping tables:', error.message);
    }

    // 创建用户表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');

    // 创建猫咪表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS cats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        breed VARCHAR(255),
        age INT,
        age_display VARCHAR(50),
        description TEXT,
        adoption_status ENUM('available', 'adopted', 'pending') DEFAULT 'available',
        adoption_requirements TEXT,
        adoption_date DATE,
        likes INT DEFAULT 0,
        views INT DEFAULT 0,
        is_hot BOOLEAN DEFAULT FALSE,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Cats table created or already exists');

    // 创建猫咪点赞表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS cat_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        cat_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_cat (user_id, cat_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (cat_id) REFERENCES cats(id)
      )
    `);
    console.log('Cat likes table created or already exists');

    // 创建帖子表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        cat_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        video VARCHAR(255),
        images JSON,
        likes_count INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (cat_id) REFERENCES cats(id)
      )
    `);
    console.log('Posts table created or already exists');

    // 创建点赞表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_post (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `);
    console.log('Likes table created or already exists');

    // 创建评论表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT,
        cat_id INT,
        parent_id INT,
        content TEXT NOT NULL,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (cat_id) REFERENCES cats(id),
        FOREIGN KEY (parent_id) REFERENCES comments(id)
      )
    `);
    console.log('Comments table created or already exists');

    // 创建评论点赞表
    await connectionWithDB.query(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        comment_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_comment (user_id, comment_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comment_id) REFERENCES comments(id)
      )
    `);
    console.log('Comment likes table created or already exists');

    // 关闭连接
    await connectionWithDB.end();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// 执行初始化
initDatabase();
