# 猫咪社区前端API说明文档

## 1. 认证接口

### 用户登录
- **URL**: `/api/users/login`
- **方法**: `POST`
- **参数**:
  - `account`: 账号
  - `password`: 密码
- **返回**: JWT token 和用户信息

### 用户注册
- **URL**: `/api/users/register`
- **方法**: `POST`
- **参数**:
  - `name`: 用户名
  - `account`: 账号
  - `password`: 密码
- **返回**: 注册成功信息

## 2. 猫咪相关接口

### 公开接口（无需登录）

#### 获取热门猫咪
- **URL**: `/api/cats/public/hot`
- **方法**: `GET`
- **参数**: 无
- **返回**: 热门猫咪列表（按点赞和浏览量排序）

#### 获取最新领养信息
- **URL**: `/api/cats/public/latest`
- **方法**: `GET`
- **参数**: 无
- **返回**: 最新可领养猫咪列表

#### 获取猫咪详情
- **URL**: `/api/cats/public/:id`
- **方法**: `GET`
- **参数**: `id` (路径参数)
- **返回**: 猫咪详细信息

### 需要认证的接口

#### 获取所有猫咪
- **URL**: `/api/cats`
- **方法**: `GET`
- **参数**:
  - `status`: 领养状态筛选 (可选)
  - `sort`: 排序方式 (`latest` 或 `popular`)
- **返回**: 猫咪列表

#### 创建猫咪
- **URL**: `/api/cats`
- **方法**: `POST`
- **参数**:
  - `name`: 猫咪名字
  - `breed`: 品种
  - `age`: 年龄(数字)
  - `age_display`: 年龄显示(如"2岁")
  - `description`: 描述
  - `adoption_requirements`: 领养要求
  - `image`: 图片文件 (FormData)
- **返回**: 创建的猫咪信息

#### 更新猫咪
- **URL**: `/api/cats/:id`
- **方法**: `PUT`
- **参数**:
  - `name`: 猫咪名字
  - `breed`: 品种
  - `age`: 年龄
  - `age_display`: 年龄显示
  - `description`: 描述
  - `adoption_status`: 领养状态
  - `adoption_requirements`: 领养要求
  - `adoption_date`: 领养日期
  - `is_hot`: 是否热门
  - `image`: 图片文件 (可选)
- **返回**: 更新后的猫咪信息

#### 删除猫咪
- **URL**: `/api/cats/:id`
- **方法**: `DELETE`
- **参数**: `id` (路径参数)
- **返回**: 删除成功信息

#### 点赞猫咪
- **URL**: `/api/cats/:id/like`
- **方法**: `POST`
- **参数**: `id` (路径参数)
- **返回**: 更新后的点赞数

#### 更新领养状态
- **URL**: `/api/cats/:id/adoption`
- **方法**: `PUT`
- **参数**:
  - `status`: 领养状态 (`available`, `adopted`, `pending`)
  - `date`: 领养日期
- **返回**: 更新成功信息

## 3. 社区相关接口

### 帖子管理
- **URL**: `/api/posts`
- **方法**: `GET`, `POST`, `PUT`, `DELETE`
- **功能**: 帖子的增删改查

### 点赞功能
- **URL**: `/api/likes`
- **方法**: `POST`, `DELETE`
- **功能**: 帖子点赞/取消点赞

### 评论功能
- **URL**: `/api/comments`
- **方法**: `GET`, `POST`, `PUT`, `DELETE`
- **功能**: 评论的增删改查

## 4. 认证说明
- 所有需要认证的接口，需在请求头中添加 `Authorization: Bearer <token>`
- Token 有效期：24小时
- 过期后需重新登录获取新token

## 5. 响应格式

### 成功响应
```json
{
  "id": 1,
  "name": "小橘",
  "breed": "橘猫",
  "age": 2,
  "age_display": "2岁",
  "description": "可爱的橘色猫咪",
  "adoption_status": "available",
  "adoption_requirements": "有稳定收入",
  "likes": 0,
  "views": 1,
  "image": "cat1.jpg",
  "created_at": "2026-02-25T03:00:00Z"
}
```

### 错误响应
```json
{
  "error": "错误信息"
}
```

## 6. 基础URL
- **开发环境**: `http://localhost:3000`
- **生产环境**: 部署后的服务器地址

## 7. 注意事项
- 图片上传限制为10MB
- 所有POST/PUT请求使用 `Content-Type: application/json`
- 文件上传使用 `multipart/form-data`
- 分页功能后续版本支持