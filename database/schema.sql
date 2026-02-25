-- 创建数据库
CREATE DATABASE IF NOT EXISTS animal_api;

-- 使用数据库
USE animal_api;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  account VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建猫咪表
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
);

-- 创建猫咪点赞表
CREATE TABLE IF NOT EXISTS cat_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cat_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_cat (user_id, cat_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (cat_id) REFERENCES cats(id)
);
