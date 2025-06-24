# Review API Documentation

## Tổng quan
Review API cho phép người dùng đánh giá các booking đã hoàn thành và quản lý các đánh giá.

## Endpoints

### 1. Tạo đánh giá mới
**POST** `/review`

Tạo một đánh giá mới cho booking đã hoàn thành.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookingId": 1,
  "rating": 5,
  "comment": "Dịch vụ rất tốt, nhân viên làm việc cẩn thận!"
}
```

**Parameters:**
- `bookingId` (int, required): ID của booking cần đánh giá
- `rating` (int, required): Số sao từ 1-5
- `comment` (string, optional): Nhận xét của khách hàng (tối đa 500 ký tự)

**Response (200):**
```json
{
  "id": 1,
  "bookingId": 1,
  "userId": 1,
  "userName": "Nguyễn Văn A",
  "cleanerId": 2,
  "cleanerName": "Trần Thị B",
  "rating": 5,
  "comment": "Dịch vụ rất tốt, nhân viên làm việc cẩn thận!",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- Booking phải tồn tại và thuộc về user đang đăng nhập
- Booking phải có trạng thái "completed"
- Booking phải có cleaner được assign
- User chưa đánh giá booking này trước đó
- Rating phải từ 1-5

### 2. Kiểm tra user đã đánh giá booking chưa
**GET** `/review/check/{bookingId}`

Kiểm tra xem user hiện tại đã đánh giá booking này chưa.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
true
```
hoặc
```json
false
```

### 3. Lấy đánh giá theo booking ID
**GET** `/review/booking/{bookingId}`

Lấy thông tin đánh giá của một booking cụ thể.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "bookingId": 1,
  "userId": 1,
  "userName": "Nguyễn Văn A",
  "cleanerId": 2,
  "cleanerName": "Trần Thị B",
  "rating": 5,
  "comment": "Dịch vụ rất tốt!",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response (404):**
```json
{
  "message": "Review not found"
}
```

### 4. Sửa đánh giá
**PUT** `/review/{bookingId}`

Sửa đánh giá của user cho booking đã đánh giá trước đó.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Dịch vụ đã được cải thiện, tôi hài lòng hơn."
}
```

**Response (200):**
```json
{
  "id": 1,
  "bookingId": 1,
  "userId": 1,
  "userName": "Nguyễn Văn A",
  "cleanerId": 2,
  "cleanerName": "Trần Thị B",
  "rating": 4,
  "comment": "Dịch vụ đã được cải thiện, tôi hài lòng hơn.",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Validation:**
- Chỉ user đã đánh giá booking đó mới được sửa
- Rating phải từ 1-5
- Comment tối đa 500 ký tự (có thể null)

## Error Responses

### 400 Bad Request
```json
{
  "message": "Booking not found or does not belong to user"
}
```

```json
{
  "message": "Can only review completed bookings"
}
```

```json
{
  "message": "Cannot review booking without assigned cleaner"
}
```

```json
{
  "message": "User has already reviewed this booking"
}
```

```json
{
  "message": "Rating must be between 1 and 5"
}
```

### 401 Unauthorized
```json
{
  "message": "Bạn chưa đăng nhập hoặc token không hợp lệ."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

## Sử dụng trong Frontend

### Tạo đánh giá
```typescript
import { reviewApi } from '@/app/api/services/reviewApi';

const createReview = async () => {
  try {
    const token = localStorage.getItem('token');
    const review = await reviewApi.createReview({
      bookingId: 1,
      rating: 5,
      comment: "Dịch vụ rất tốt!"
    }, token);
    console.log('Review created:', review);
  } catch (error) {
    console.error('Error creating review:', error);
  }
};
```

### Kiểm tra đã đánh giá chưa
```typescript
const checkReview = async (bookingId: number) => {
  try {
    const token = localStorage.getItem('token');
    const hasReviewed = await reviewApi.checkUserReviewedBooking(bookingId, token);
    if (hasReviewed) {
      const review = await reviewApi.getReviewByBookingId(bookingId, token);
      console.log('Existing review:', review);
    }
  } catch (error) {
    console.error('Error checking review:', error);
  }
};
```

## Database Schema

### Reviews Table
```sql
CREATE TABLE Reviews (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  BookingId INT NOT NULL,
  UserId INT NOT NULL,
  CleanerId INT NOT NULL,
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Comment NVARCHAR(500),
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (BookingId) REFERENCES Bookings(Id),
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (CleanerId) REFERENCES Users(Id)
);
```

## Lưu ý
- Chỉ có thể đánh giá booking có trạng thái "completed"
- Booking phải có cleaner được assign
- Mỗi user chỉ có thể đánh giá một booking một lần
- Rating phải từ 1-5 sao
- Comment là tùy chọn, tối đa 500 ký tự
- Tất cả endpoints đều yêu cầu authentication
- UserId sẽ là người tạo feedback (người đăng nhập)
- CleanerId sẽ được lấy từ booking đã hoàn thành 