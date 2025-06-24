# News API Documentation

## Tổng quan
API này cung cấp các endpoint để quản lý và hiển thị các bài viết (tin tức). Các endpoint được chia thành hai nhóm: công khai cho người dùng và được bảo vệ cho quản trị viên.

## Authentication
- Các endpoint công khai không yêu cầu authentication.
- Các endpoint của admin yêu cầu JWT token với role "admin".

---

## Public Endpoints

### 1. Lấy danh sách bài viết
**GET** `/api/news`

Lấy danh sách các bài viết đã được xuất bản, có hỗ trợ phân trang và lọc.

**Query Parameters:**
- `page` (int, optional, default: 1): Số trang hiện tại.
- `pageSize` (int, optional, default: 10): Số lượng bài viết trên mỗi trang.
- `category` (string, optional): Lọc bài viết theo `slug` của chủ đề.
- `tag` (string, optional): Lọc bài viết theo `slug` của thẻ.

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Tiêu đề bài viết",
      "slug": "tieu-de-bai-viet",
      "excerpt": "Đây là nội dung tóm tắt của bài viết...",
      "imageUrl": "https://example.com/image.jpg",
      "publishDate": "2024-07-28T10:00:00Z",
      "readTime": "5 phút",
      "category": {
        "id": 1,
        "name": "Công nghệ",
        "slug": "cong-nghe"
      },
      "author": {
        "id": 1,
        "name": "Admin"
      }
    }
  ],
  "totalCount": 50,
  "page": 1,
  "pageSize": 10
}
```

### 2. Lấy bài viết nổi bật
**GET** `/api/news/featured`

Lấy danh sách các bài viết được đánh dấu là "nổi bật".

### 3. Lấy chi tiết bài viết
**GET** `/api/news/{idOrSlug}`

Lấy thông tin chi tiết của một bài viết bằng `ID` hoặc `slug`.

**Response:**
```json
{
  "id": 1,
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "excerpt": "...",
  "imageUrl": "...",
  "publishDate": "...",
  "readTime": "...",
  "category": { ... },
  "author": { ... },
  "content": "<h1>Nội dung HTML của bài viết</h1><p>...</p>",
  "tags": [
    { "id": 1, "name": "Web", "slug": "web" }
  ],
  "relatedArticles": [
    { ... } // Danh sách các bài viết liên quan
  ]
}
```

### 4. Lấy danh sách chủ đề
**GET** `/api/news/categories`

### 5. Lấy danh sách thẻ
**GET** `/api/news/tags`

---

## Admin Endpoints

### 1. Tạo bài viết mới
**POST** `/api/news`

**Request Body:** (`CreateNewsArticleDto`)
```json
{
  "title": "Bài Viết Mới",
  "excerpt": "Nội dung tóm tắt.",
  "content": "Nội dung đầy đủ.",
  "categoryId": 1,
  "readTime": "5 phút",
  "isFeatured": true,
  "imageUrl": "https://...",
  "isActive": true,
  "tagIds": [1, 2]
}
```

### 2. Cập nhật bài viết
**PUT** `/api/news/{id}`

**Request Body:** (`UpdateNewsArticleDto`)
- Tương tự như body của request tạo mới.

### 3. Xóa bài viết
**DELETE** `/api/news/{id}`
- Thực hiện xóa mềm (soft delete) bằng cách cập nhật cờ `IsActive = false`.
- Response: `204 No Content` nếu thành công. 