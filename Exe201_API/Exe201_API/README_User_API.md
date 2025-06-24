# User & Booking API Documentation

## Tổng quan
API này cung cấp các endpoint cho người dùng (`user`) để quản lý thông tin cá nhân và các lịch đặt dịch vụ.

## Authentication
Tất cả các API đều yêu cầu JWT token với role "user".

## User Endpoints

### 1. Lấy thông tin Profile
**GET** `/api/user/profile`

Lấy thông tin cá nhân của người dùng hiện tại.

**Response:**
```json
{
  "id": 2,
  "name": "Người Dùng A",
  "email": "user@example.com",
  "phone": "0123456789",
  "address": "456 Đường DEF, Quận 2, TP.HCM",
  "role": "user",
  "status": "active",
  "experience": null,
  "createdAt": "2024-01-02T00:00:00Z"
}
```

### 2. Cập nhật thông tin Profile
**PUT** `/api/user/profile`

Cập nhật thông tin cá nhân của người dùng.

**Request Body:**
```json
{
  "name": "Tên Người Dùng Mới",
  "phone": "0987654321",
  "address": "Địa chỉ mới, Quận 1, TP. HCM"
}
```

**Response:**
- Trả về thông tin profile đã được cập nhật (tương tự response của `GET /api/user/profile`).

## Booking Endpoints

### 1. Lấy danh sách lịch đặt
**GET** `/api/bookings`

Lấy danh sách các lịch đặt của người dùng hiện tại.

**Query Parameters:**
- `status` (optional): Lọc theo trạng thái (e.g., `all`, `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`). Mặc định là `all`.

**Response:**
```json
[
  {
    "id": 1,
    "userName": "Người Dùng A",
    "serviceName": "Dọn Nhà Định Kỳ",
    "areaSizeName": "50-100m²",
    "timeSlotRange": "08:00-10:00",
    "bookingDate": "2024-01-15",
    "address": "456 Đường DEF, Quận 2, TP.HCM",
    "contactName": "Người Dùng A",
    "contactPhone": "0123456789",
    "notes": "Lau dọn kỹ ban công.",
    "totalPrice": 500000,
    "status": "confirmed",
    "cleanerName": "Cleaner B",
    "createdAt": "2024-01-10T11:00:00Z"
  }
]
```

### 2. Lấy chi tiết lịch đặt
**GET** `/api/bookings/{id}`

Lấy thông tin chi tiết của một lịch đặt cụ thể. Endpoint này sẽ kiểm tra quyền sở hữu, đảm bảo bạn chỉ xem được lịch đặt của chính mình.

**Response:**
- Trả về một object `BookingResponseDto` duy nhất, tương tự như một phần tử trong mảng ở mục 2.1.

### 3. Lấy thống kê Dashboard
**GET** `/api/bookings/dashboard-stats`

Lấy các số liệu thống kê cho trang dashboard của người dùng.

**Response:**
```json
{
  "totalBookings": 10,
  "pendingBookings": 2,
  "completedBookings": 5,
  "totalSpent": 3500000
}
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": {
    "Phone": [
      "Số điện thoại không hợp lệ"
    ]
  },
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "..."
}
```

### 401 Unauthorized
```json
{
  "message": "Bạn chưa đăng nhập hoặc token không hợp lệ."
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy người dùng"
}
```

## Testing

Sử dụng file `User_API.http` để test các API với các biến môi trường:
- `{{baseUrl}}`: URL base của API
- `{{userToken}}`: JWT token của user. 