# Cleaner API Documentation

## Tổng quan
API này cung cấp các endpoint cho cleaner để quản lý công việc dọn vệ sinh.

## Authentication
Tất cả các API đều yêu cầu JWT token với role "cleaner".

## Endpoints

### 1. Lấy thông tin profile
**GET** `/api/cleaner/profile`

Lấy thông tin cá nhân của cleaner hiện tại.

**Response:**
```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "cleaner@example.com",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "role": "cleaner",
  "status": "active",
  "experience": "3 năm",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 2. Lấy danh sách việc có sẵn
**GET** `/api/cleaner/available-jobs`

Lấy danh sách các booking đang chờ (pending) và chưa được assign cho cleaner nào.

**Response:**
```json
[
  {
    "id": 1,
    "serviceName": "Dọn Nhà Định Kỳ",
    "areaSize": "50-100m²",
    "timeSlot": "08:00-10:00",
    "bookingDate": "2024-01-15",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "contactName": "Nguyễn Văn B",
    "contactPhone": "0987654321",
    "notes": "Cần dọn sạch sẽ",
    "totalPrice": 500000,
    "status": "pending",
    "cleanerId": null,
    "cleanerName": null,
    "createdAt": "2024-01-10T10:00:00Z"
  }
]
```

### 3. Lấy danh sách việc của cleaner
**GET** `/api/cleaner/my-jobs?status=all`

Lấy danh sách các booking đã được assign cho cleaner hiện tại.

**Query Parameters:**
- `status` (optional): Lọc theo trạng thái (all, confirmed, in_progress, completed, cancelled)

**Response:**
```json
[
  {
    "id": 2,
    "serviceName": "Dọn Văn Phòng",
    "areaSize": "100-200m²",
    "timeSlot": "14:00-16:00",
    "bookingDate": "2024-01-16",
    "address": "456 Đường XYZ, Quận 3, TP.HCM",
    "contactName": "Trần Thị C",
    "contactPhone": "0123456789",
    "notes": null,
    "totalPrice": 800000,
    "status": "confirmed",
    "cleanerId": 1,
    "cleanerName": "Nguyễn Văn A",
    "createdAt": "2024-01-11T09:00:00Z"
  }
]
```

### 4. Nhận việc
**POST** `/api/cleaner/accept-job/{bookingId}`

Cleaner nhận một booking đang chờ.

**Path Parameters:**
- `bookingId`: ID của booking cần nhận

**Response:**
```json
{
  "id": 1,
  "serviceName": "Dọn Nhà Định Kỳ",
  "areaSize": "50-100m²",
  "timeSlot": "08:00-10:00",
  "bookingDate": "2024-01-15",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "contactName": "Nguyễn Văn B",
  "contactPhone": "0987654321",
  "notes": "Cần dọn sạch sẽ",
  "totalPrice": 500000,
  "status": "confirmed",
  "cleanerId": 1,
  "cleanerName": "Nguyễn Văn A",
  "createdAt": "2024-01-10T10:00:00Z",
  "updatedAt": "2024-01-12T15:30:00Z"
}
```

### 5. Cập nhật trạng thái việc
**PUT** `/api/cleaner/update-job-status/{bookingId}`

Cập nhật trạng thái của booking.

**Path Parameters:**
- `bookingId`: ID của booking cần cập nhật

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Trạng thái hợp lệ:**
- `confirmed` → `in_progress`
- `in_progress` → `completed`
- `in_progress` → `cancelled`
- `confirmed` → `cancelled`

**Response:**
```json
{
  "id": 2,
  "serviceName": "Dọn Văn Phòng",
  "areaSize": "100-200m²",
  "timeSlot": "14:00-16:00",
  "bookingDate": "2024-01-16",
  "address": "456 Đường XYZ, Quận 3, TP.HCM",
  "contactName": "Trần Thị C",
  "contactPhone": "0123456789",
  "notes": null,
  "totalPrice": 800000,
  "status": "in_progress",
  "cleanerId": 1,
  "cleanerName": "Nguyễn Văn A",
  "createdAt": "2024-01-11T09:00:00Z",
  "updatedAt": "2024-01-12T16:00:00Z"
}
```

### 6. Lấy thống kê dashboard
**GET** `/api/cleaner/dashboard-stats`

Lấy thống kê tổng quan cho dashboard của cleaner.

**Response:**
```json
{
  "availableJobs": 5,
  "myJobs": 3,
  "completedJobs": 15,
  "totalEarnings": 7500000,
  "pendingJobs": 1,
  "inProgressJobs": 2
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Booking này không thể được assign"
}
```

### 401 Unauthorized
```json
{
  "message": "Bạn không có quyền cập nhật booking này"
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

## Trạng thái Booking

- `pending`: Chờ xác nhận (chưa có cleaner)
- `confirmed`: Đã xác nhận (đã có cleaner)
- `in_progress`: Đang thực hiện
- `completed`: Hoàn thành
- `cancelled`: Đã hủy

## Testing

Sử dụng file `Cleaner_API.http` để test các API với các biến môi trường:
- `{{baseUrl}}`: URL base của API
- `{{cleanerToken}}`: JWT token của cleaner 