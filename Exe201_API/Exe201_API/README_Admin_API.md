# Admin API Documentation

## Tổng quan
API này cung cấp các endpoint cho quản trị viên để quản lý toàn bộ hệ thống dịch vụ dọn vệ sinh.

## Authentication
Tất cả các API đều yêu cầu JWT token với role "admin".

## Endpoints

### 1. Dashboard Statistics
**GET** `/api/admin/dashboard-stats`

Lấy thống kê tổng quan cho dashboard admin.

**Response:**
```json
{
  "totalCustomers": 21,
  "totalCleaners": 4,
  "totalBookings": 25,
  "totalRevenue": 2958000,
  "totalBills": 21,
  "pendingCleaners": 2,
  "activeCleaners": 2,
  "recentBookings": 5,
  "recentRevenue": 500000,
  "bookingsByStatus": {
    "pending": 3,
    "confirmed": 5,
    "in_progress": 2,
    "completed": 12,
    "cancelled": 3
  },
  "revenueByService": {
    "Dọn Nhà Định Kỳ": 1500000,
    "Dọn Văn Phòng": 800000,
    "Dọn Sau Xây Dựng": 400000,
    "Dọn Cuối Năm": 258000
  }
}
```

### 2. Booking Management

#### 2.1 Lấy danh sách tất cả booking
**GET** `/api/admin/bookings`

**Query Parameters:**
- `page` (int, optional, default: 1): Số trang
- `pageSize` (int, optional, default: 10): Số lượng booking trên mỗi trang
- `search` (string, optional): Tìm kiếm theo tên, địa chỉ, hoặc ID
- `status` (string, optional): Lọc theo trạng thái

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "userName": "Nguyễn Văn A",
      "serviceName": "Dọn Nhà Định Kỳ",
      "areaSizeName": "50-100m²",
      "timeSlotRange": "08:00-10:00",
      "bookingDate": "2024-01-15",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "contactName": "Nguyễn Văn A",
      "contactPhone": "0123456789",
      "notes": "Cần dọn sạch sẽ",
      "totalPrice": 500000,
      "status": "pending",
      "cleanerName": null,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "totalCount": 25,
  "page": 1,
  "pageSize": 10
}
```

#### 2.2 Lấy chi tiết booking
**GET** `/api/admin/bookings/{id}`

#### 2.3 Cập nhật trạng thái booking
**PUT** `/api/admin/bookings/{id}/status`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

### 3. Customer Management

#### 3.1 Lấy danh sách khách hàng
**GET** `/api/admin/customers`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "createdAt": "2024-01-01T00:00:00Z",
    "totalBookings": 3,
    "totalSpent": 1500000
  }
]
```

### 4. Cleaner Management

#### 4.1 Lấy danh sách nhân viên
**GET** `/api/admin/cleaners`

**Response:**
```json
[
  {
    "id": 2,
    "name": "Trần Thị B",
    "email": "tranthib@example.com",
    "phone": "0987654321",
    "address": "456 Đường XYZ, Quận 2, TP.HCM",
    "experience": "3 năm",
    "status": "active",
    "createdAt": "2024-01-02T00:00:00Z",
    "totalJobs": 15,
    "completedJobs": 12,
    "totalEarnings": 6000000
  }
]
```

#### 4.2 Cập nhật trạng thái nhân viên
**PUT** `/api/admin/cleaners/{id}/status`

**Request Body:**
```json
{
  "status": "active"
}
```

### 5. Bill Management

#### 5.1 Lấy danh sách hóa đơn
**GET** `/api/admin/bills`

**Response:**
```json
[
  {
    "id": 1,
    "billId": "00001",
    "customerEmail": "nguyenvana@example.com",
    "amount": 500000,
    "status": "paid",
    "date": "2024-01-15T00:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Dữ liệu không hợp lệ"
}
```

### 401 Unauthorized
```json
{
  "message": "Bạn chưa đăng nhập hoặc token không hợp lệ."
}
```

### 403 Forbidden
```json
{
  "message": "Bạn không có quyền truy cập vào tài nguyên này."
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy booking"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi hệ thống",
  "detail": "Chi tiết lỗi"
}
```

## Testing

Sử dụng file `Admin_API.http` để test các API với các biến môi trường:
- `{{baseUrl}}`: URL base của API
- `{{adminToken}}`: JWT token của admin

## Trạng thái Booking

- `pending`: Chờ xử lý
- `confirmed`: Đã xác nhận
- `in_progress`: Đang thực hiện
- `completed`: Hoàn thành
- `cancelled`: Đã hủy

## Trạng thái Cleaner

- `pending`: Chờ phê duyệt
- `active`: Đang hoạt động
- `rejected`: Đã từ chối 