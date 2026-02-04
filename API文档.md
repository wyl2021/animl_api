# 猫咪网站API接口文档

## 1. 项目简介

本文档描述了猫咪网站的后端API接口，包括用户管理、猫咪管理、社区互动（帖子、点赞、评论）等功能。

## 2. 基础信息

### 2.1 API基础URL
```
http://localhost:3000/api
```

### 2.2 响应格式
所有API响应均为JSON格式，包含以下基本结构：
```json
{
  "status": "success|error",
  "data": {...},
  "message": "..."
}
```

### 2.3 错误处理
当API请求失败时，返回的响应格式如下：
```json
{
  "error": "错误信息"
}
```

## 3. 用户管理API

### 3.1 创建用户
- **请求方法**: POST
- **端点路径**: `/users`
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "name": "张三",
    "email": "zhangsan@example.com",
    "password": "123456"
  }
  ```
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
  ```

### 3.2 获取所有用户
- **请求方法**: GET
- **端点路径**: `/users`
- **响应示例**:
  ```json
  [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "created_at": "2026-01-28T15:23:33.000Z"
    }
  ]
  ```

### 3.3 获取单个用户
- **请求方法**: GET
- **端点路径**: `/users/:id`
- **路径参数**:
  - `id`: 用户ID
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "created_at": "2026-01-28T15:23:33.000Z"
  }
  ```

### 3.4 更新用户
- **请求方法**: PUT
- **端点路径**: `/users/:id`
- **路径参数**:
  - `id`: 用户ID
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "name": "李四",
    "email": "lisi@example.com",
    "password": "654321"
  }
  ```
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "李四",
    "email": "lisi@example.com"
  }
  ```

### 3.5 删除用户
- **请求方法**: DELETE
- **端点路径**: `/users/:id`
- **路径参数**:
  - `id`: 用户ID
- **响应示例**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## 4. 猫咪管理API

### 4.1 创建猫咪
- **请求方法**: POST
- **端点路径**: `/cats`
- **请求类型**: `multipart/form-data`
- **请求参数**:
  - `name`: 猫咪名称 (必填)
  - `breed`: 猫咪品种
  - `age`: 猫咪年龄
  - `description`: 猫咪描述
  - `image`: 猫咪图片 (文件)
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "小白",
    "breed": "英短",
    "age": 2,
    "description": "一只可爱的猫咪，性格温顺，喜欢撒娇。",
    "image": "1674910000000.jpg"
  }
  ```

### 4.2 获取所有猫咪
- **请求方法**: GET
- **端点路径**: `/cats`
- **响应示例**:
  ```json
  [
    {
      "id": 1,
      "name": "小白",
      "breed": "英短",
      "age": 2,
      "description": "一只可爱的猫咪，性格温顺，喜欢撒娇。",
      "image": "1674910000000.jpg",
      "created_at": "2026-01-28T15:24:20.000Z",
      "updated_at": "2026-01-28T15:24:20.000Z"
    }
  ]
  ```

### 4.3 获取单个猫咪
- **请求方法**: GET
- **端点路径**: `/cats/:id`
- **路径参数**:
  - `id`: 猫咪ID
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "小白",
    "breed": "英短",
    "age": 2,
    "description": "一只可爱的猫咪，性格温顺，喜欢撒娇。",
    "image": "1674910000000.jpg",
    "created_at": "2026-01-28T15:24:20.000Z",
    "updated_at": "2026-01-28T15:24:20.000Z"
  }
  ```

### 4.4 更新猫咪
- **请求方法**: PUT
- **端点路径**: `/cats/:id`
- **路径参数**:
  - `id`: 猫咪ID
- **请求类型**: `multipart/form-data`
- **请求参数**:
  - `name`: 猫咪名称
  - `breed`: 猫咪品种
  - `age`: 猫咪年龄
  - `description`: 猫咪描述
  - `image`: 猫咪图片 (文件)
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "小黑",
    "breed": "美短",
    "age": 3,
    "description": "活泼好动的猫咪，喜欢玩逗猫棒。",
    "image": "1674910000001.jpg"
  }
  ```

### 4.5 删除猫咪
- **请求方法**: DELETE
- **端点路径**: `/cats/:id`
- **路径参数**:
  - `id`: 猫咪ID
- **响应示例**:
  ```json
  {
    "message": "Cat deleted successfully"
  }
  ```

## 5. 社区功能API

### 5.1 创建帖子
- **请求方法**: POST
- **端点路径**: `/posts`
- **请求类型**: `multipart/form-data`
- **请求参数**:
  - `user_id`: 用户ID (必填)
  - `cat_id`: 猫咪ID (必填)
  - `title`: 帖子标题 (必填)
  - `content`: 帖子内容 (必填)
  - `image`: 帖子图片 (文件)
- **响应示例**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "cat_id": 1,
    "title": "我家猫咪的趣事",
    "content": "今天我家猫咪居然学会了开抽屉，太聪明了！",
    "image": "1674910000000.jpg"
  }
  ```

### 5.2 获取帖子列表
- **请求方法**: GET
- **端点路径**: `/posts`
- **响应示例**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "cat_id": 1,
      "title": "我家猫咪的趣事",
      "content": "今天我家猫咪居然学会了开抽屉，太聪明了！",
      "image": "1674910000000.jpg",
      "likes_count": 10,
      "comments_count": 5,
      "created_at": "2026-01-28T15:53:20.000Z",
      "updated_at": "2026-01-28T15:53:20.000Z",
      "user_name": "张三",
      "cat_name": "小白",
      "cat_breed": "英短"
    }
  ]
  ```

### 5.3 获取帖子详情
- **请求方法**: GET
- **端点路径**: `/posts/:id`
- **路径参数**:
  - `id`: 帖子ID
- **响应示例**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "cat_id": 1,
    "title": "我家猫咪的趣事",
    "content": "今天我家猫咪居然学会了开抽屉，太聪明了！",
    "image": "1674910000000.jpg",
    "likes_count": 10,
    "comments_count": 5,
    "created_at": "2026-01-28T15:53:20.000Z",
    "updated_at": "2026-01-28T15:53:20.000Z",
    "user_name": "张三",
    "cat_name": "小白",
    "cat_breed": "英短",
    "comments": [
      {
        "id": 1,
        "user_id": 1,
        "post_id": 1,
        "content": "太有趣了，我家猫咪也很聪明！",
        "created_at": "2026-01-28T15:55:37.000Z",
        "updated_at": "2026-01-28T15:55:37.000Z",
        "user_name": "张三"
      }
    ]
  }
  ```

### 5.4 更新帖子
- **请求方法**: PUT
- **端点路径**: `/posts/:id`
- **路径参数**:
  - `id`: 帖子ID
- **请求类型**: `multipart/form-data`
- **请求参数**:
  - `title`: 帖子标题
  - `content`: 帖子内容
  - `image`: 帖子图片 (文件)
- **响应示例**:
  ```json
  {
    "id": 1,
    "title": "我家猫咪的新趣事",
    "content": "今天我家猫咪又学会了一个新技能！",
    "image": "1674910000001.jpg"
  }
  ```

### 5.5 删除帖子
- **请求方法**: DELETE
- **端点路径**: `/posts/:id`
- **路径参数**:
  - `id`: 帖子ID
- **响应示例**:
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

## 6. 点赞功能API

### 6.1 给帖子点赞
- **请求方法**: POST
- **端点路径**: `/likes`
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "user_id": 1,
    "post_id": 1
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Liked successfully"
  }
  ```
- **注意**: 同一用户不能重复点赞同一帖子

### 6.2 取消点赞
- **请求方法**: DELETE
- **端点路径**: `/likes`
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "user_id": 1,
    "post_id": 1
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "Unliked successfully"
  }
  ```

### 6.3 检查用户是否已点赞
- **请求方法**: GET
- **端点路径**: `/likes/check`
- **查询参数**:
  - `user_id`: 用户ID
  - `post_id`: 帖子ID
- **响应示例**:
  ```json
  {
    "liked": true
  }
  ```

## 7. 评论功能API

### 7.1 创建评论
- **请求方法**: POST
- **端点路径**: `/comments`
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "user_id": 1,
    "post_id": 1,
    "content": "太有趣了，我家猫咪也很聪明！"
  }
  ```
- **响应示例**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "post_id": 1,
    "content": "太有趣了，我家猫咪也很聪明！"
  }
  ```

### 7.2 获取帖子的评论列表
- **请求方法**: GET
- **端点路径**: `/comments/post/:post_id`
- **路径参数**:
  - `post_id`: 帖子ID
- **响应示例**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "post_id": 1,
      "content": "太有趣了，我家猫咪也很聪明！",
      "created_at": "2026-01-28T15:55:37.000Z",
      "updated_at": "2026-01-28T15:55:37.000Z",
      "user_name": "张三"
    }
  ]
  ```

### 7.3 更新评论
- **请求方法**: PUT
- **端点路径**: `/comments/:id`
- **路径参数**:
  - `id`: 评论ID
- **请求头**: `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "content": "更新后的评论内容"
  }
  ```
- **响应示例**:
  ```json
  {
    "id": 1,
    "content": "更新后的评论内容"
  }
  ```

### 7.4 删除评论
- **请求方法**: DELETE
- **端点路径**: `/comments/:id`
- **路径参数**:
  - `id`: 评论ID
- **响应示例**:
  ```json
  {
    "message": "Comment deleted successfully"
  }
  ```

## 8. 图片访问

上传的图片可以通过以下URL访问：
```
http://localhost:3000/uploads/[图片文件名]
```

例如：
```
http://localhost:3000/uploads/1674910000000.jpg
```

## 9. 前端集成示例

### 9.1 使用Fetch API创建用户
```javascript
async function createUser() {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: '张三',
      email: 'zhangsan@example.com',
      password: '123456'
    })
  });
  const data = await response.json();
  console.log(data);
}
```

### 9.2 使用Fetch API上传猫咪图片
```javascript
async function createCat() {
  const formData = new FormData();
  formData.append('name', '小白');
  formData.append('breed', '英短');
  formData.append('age', 2);
  formData.append('description', '一只可爱的猫咪');
  formData.append('image', document.querySelector('input[type="file"]').files[0]);

  const response = await fetch('http://localhost:3000/api/cats', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log(data);
}
```

### 9.3 使用Fetch API创建帖子
```javascript
async function createPost() {
  const formData = new FormData();
  formData.append('user_id', 1);
  formData.append('cat_id', 1);
  formData.append('title', '我家猫咪的趣事');
  formData.append('content', '今天我家猫咪学会了新技能！');
  formData.append('image', document.querySelector('input[type="file"]').files[0]);

  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log(data);
}
```

### 9.4 使用Fetch API点赞帖子
```javascript
async function likePost(userId, postId) {
  const response = await fetch('http://localhost:3000/api/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      post_id: postId
    })
  });
  const data = await response.json();
  console.log(data);
}
```

### 9.5 使用Fetch API创建评论
```javascript
async function createComment(userId, postId, content) {
  const response = await fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      post_id: postId,
      content: content
    })
  });
  const data = await response.json();
  console.log(data);
}
```

## 10. 注意事项

1. 所有API请求都需要在基础URL后添加相应的端点路径。
2. 创建和更新猫咪、帖子时，图片上传使用`multipart/form-data`格式。
3. 图片上传后会存储在服务器的`uploads`目录中。
4. 数据库连接信息已配置为`mysql -u root -p '123456'`，请确保MySQL数据库已安装并运行。
5. 服务器运行在`http://localhost:3000`端口。
6. 点赞功能有唯一性限制，同一用户不能重复点赞同一帖子。
7. 删除帖子会同时删除相关的点赞和评论记录。
8. 删除评论会自动更新帖子的评论数。
9. 点赞和取消点赞会自动更新帖子的点赞数。
10. 帖子详情接口会包含该帖子的所有评论信息。

## 11. 数据库表结构

### 11.1 users表
- id: INT (自增主键)
- name: VARCHAR(255) (用户名)
- email: VARCHAR(255) (邮箱，唯一)
- password: VARCHAR(255) (密码)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)

### 11.2 cats表
- id: INT (自增主键)
- name: VARCHAR(255) (猫咪名称)
- breed: VARCHAR(255) (猫咪品种)
- age: INT (猫咪年龄)
- description: TEXT (猫咪描述)
- image: VARCHAR(255) (图片路径)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)

### 11.3 posts表
- id: INT (自增主键)
- user_id: INT (用户ID，外键)
- cat_id: INT (猫咪ID，外键)
- title: VARCHAR(255) (帖子标题)
- content: TEXT (帖子内容)
- image: VARCHAR(255) (图片路径)
- likes_count: INT (点赞数)
- comments_count: INT (评论数)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)

### 11.4 likes表
- id: INT (自增主键)
- user_id: INT (用户ID，外键)
- post_id: INT (帖子ID，外键)
- created_at: TIMESTAMP (创建时间)
- 唯一约束: (user_id, post_id)

### 11.5 comments表
- id: INT (自增主键)
- user_id: INT (用户ID，外键)
- post_id: INT (帖子ID，外键)
- content: TEXT (评论内容)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)
