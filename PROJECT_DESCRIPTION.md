# 🏠 CAREU - HỆ THỐNG QUẢN LÝ DỊCH VỤ DỌN VỆ SINH THÔNG MINH

## 📋 TỔNG QUAN DỰ ÁN

**CareU** là một nền tảng quản lý dịch vụ dọn vệ sinh toàn diện, được thiết kế để kết nối khách hàng với đội ngũ nhân viên dọn vệ sinh chuyên nghiệp. Hệ thống cung cấp trải nghiệm đặt lịch thuận tiện, theo dõi tiến độ real-time và quản lý hiệu quả cho cả khách hàng và nhà cung cấp dịch vụ.

---

## 🎯 MỤC TIÊU DỰ ÁN

- **Tự động hóa** quy trình đặt lịch và quản lý dịch vụ dọn vệ sinh
- **Tối ưu hóa** hiệu suất làm việc của nhân viên dọn vệ sinh
- **Nâng cao** trải nghiệm khách hàng với giao diện thân thiện
- **Cung cấp** công cụ quản lý toàn diện cho admin
- **Xây dựng** hệ thống đánh giá và phản hồi minh bạch

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### **Backend (ASP.NET Core Web API)**
- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server với Entity Framework Core
- **Authentication**: JWT Bearer Token
- **Architecture**: Repository pattern với Service layer
- **API Documentation**: Swagger/OpenAPI

### **Frontend (Next.js 15)**
- **Framework**: Next.js 15 với App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + localStorage
- **TypeScript**: Strict typing cho type safety
- **Responsive Design**: Mobile-first approach

---

## 👥 PHÂN QUYỀN NGƯỜI DÙNG

### **1. 🏠 KHÁCH HÀNG (Customer)**
**Quyền truy cập**: Đăng ký, đăng nhập, đặt lịch, quản lý tài khoản

#### **Chức năng chính:**
- **Đặt lịch dọn vệ sinh**:
  - Chọn loại dịch vụ (Dọn nhà định kỳ, Dọn vệ sinh sâu, Dọn vệ sinh văn phòng)
  - Chọn kích thước diện tích (1-2 phòng, 3-4 phòng, 5+ phòng)
  - Chọn thời gian (Sáng, Chiều, Tối)
  - Chọn ngày thực hiện
  - Nhập địa chỉ chi tiết
  - Thêm ghi chú đặc biệt

- **Quản lý đặt lịch**:
  - Xem danh sách đặt lịch đã thực hiện
  - Xem chi tiết từng đặt lịch
  - Theo dõi trạng thái công việc real-time
  - Hủy đặt lịch (nếu chưa được xác nhận)

- **Đánh giá và phản hồi**:
  - Đánh giá chất lượng dịch vụ (1-5 sao)
  - Viết nhận xét chi tiết
  - Xem lịch sử đánh giá

- **Quản lý tài khoản**:
  - Cập nhật thông tin cá nhân
  - Đổi mật khẩu
  - Xem lịch sử giao dịch

### **2. 🧹 NHÂN VIÊN DỌN VỆ SINH (Cleaner)**
**Quyền truy cập**: Đăng nhập, xem danh sách việc, cập nhật trạng thái

#### **Chức năng chính:**
- **Dashboard tổng quan**:
  - Xem thống kê công việc trong ngày/tuần/tháng
  - Xem tổng thu nhập
  - Xem số lượng đặt lịch đã hoàn thành
  - Xem đánh giá trung bình từ khách hàng

- **Quản lý công việc**:
  - Xem danh sách đặt lịch được phân công
  - Xem chi tiết thông tin khách hàng và yêu cầu
  - Cập nhật trạng thái công việc:
    - Đang thực hiện
    - Đã hoàn thành
    - Gặp vấn đề (cần hỗ trợ)
  - Thêm ghi chú về công việc

- **Lịch sử công việc**:
  - Xem tất cả công việc đã thực hiện
  - Xem đánh giá từ khách hàng
  - Theo dõi thu nhập theo thời gian

### **3. 👨‍💼 QUẢN TRỊ VIÊN (Admin)**
**Quyền truy cập**: Toàn quyền quản lý hệ thống

#### **Chức năng chính:**
- **Dashboard quản trị**:
  - Thống kê tổng quan hệ thống
  - Biểu đồ doanh thu theo thời gian
  - Số lượng đặt lịch theo trạng thái
  - Top nhân viên hiệu suất cao
  - Đánh giá trung bình hệ thống

- **Quản lý người dùng**:
  - Xem danh sách tất cả khách hàng
  - Xem danh sách tất cả nhân viên
  - Khóa/mở khóa tài khoản
  - Xem chi tiết thông tin người dùng

- **Quản lý đặt lịch**:
  - Xem tất cả đặt lịch trong hệ thống
  - Phân công nhân viên cho đặt lịch
  - Xử lý các trường hợp đặc biệt
  - Thống kê đặt lịch theo thời gian

- **Quản lý dịch vụ**:
  - Thêm/sửa/xóa các loại dịch vụ
  - Cập nhật giá cả
  - Quản lý kích thước diện tích
  - Quản lý khung giờ làm việc

- **Quản lý tin tức**:
  - Đăng bài viết mới
  - Chỉnh sửa bài viết
  - Quản lý danh mục tin tức
  - Quản lý tags

- **Báo cáo và thống kê**:
  - Xuất báo cáo doanh thu
  - Thống kê hiệu suất nhân viên
  - Phân tích xu hướng đặt lịch
  - Báo cáo đánh giá khách hàng

---

## 🔧 TÍNH NĂNG CHI TIẾT

### **Hệ thống đặt lịch thông minh**
- **Lựa chọn dịch vụ linh hoạt**: 3 loại dịch vụ chính với giá cả khác nhau
- **Tính toán giá tự động**: Dựa trên loại dịch vụ, kích thước diện tích
- **Lịch trình linh hoạt**: 3 khung giờ trong ngày (Sáng, Chiều, Tối)
- **Ghi chú đặc biệt**: Cho phép khách hàng mô tả yêu cầu cụ thể

### **Theo dõi trạng thái real-time**
- **Cập nhật trạng thái**: Nhân viên cập nhật tiến độ công việc
- **Thông báo tự động**: Khách hàng nhận thông báo khi trạng thái thay đổi
- **Lịch sử chi tiết**: Ghi lại toàn bộ quá trình thực hiện

### **Hệ thống đánh giá và phản hồi**
- **Đánh giá 5 sao**: Hệ thống đánh giá trực quan
- **Nhận xét chi tiết**: Khách hàng có thể viết feedback
- **Thống kê đánh giá**: Admin và nhân viên theo dõi điểm số

### **Quản lý tin tức**
- **Blog tích hợp**: Hệ thống tin tức nội bộ
- **Phân loại tin tức**: Theo danh mục và tags
- **Tìm kiếm thông minh**: Tìm kiếm bài viết theo từ khóa

### **Bảo mật và xác thực**
- **JWT Authentication**: Bảo mật API endpoints
- **Password Hashing**: BCrypt cho mật khẩu
- **Role-based Access**: Phân quyền theo vai trò
- **Email Verification**: Xác thực email khi đăng ký

---

## 📱 GIAO DIỆN NGƯỜI DÙNG

### **Thiết kế responsive**
- **Mobile-first**: Tối ưu cho thiết bị di động
- **Desktop friendly**: Giao diện đầy đủ cho máy tính
- **Cross-browser**: Tương thích với mọi trình duyệt

### **UI/UX hiện đại**
- **Material Design**: Theo chuẩn thiết kế Google
- **Dark/Light mode**: Hỗ trợ chế độ tối/sáng
- **Loading states**: Trạng thái tải mượt mà
- **Error handling**: Xử lý lỗi thân thiện

### **Components tái sử dụng**
- **shadcn/ui**: Thư viện component hiện đại
- **Tailwind CSS**: Styling utility-first
- **Custom hooks**: Logic tái sử dụng

---

## 🗄️ CƠ SỞ DỮ LIỆU

### **Các bảng chính:**
- **Users**: Thông tin người dùng (khách hàng, nhân viên, admin)
- **Bookings**: Thông tin đặt lịch
- **Services**: Danh mục dịch vụ
- **Reviews**: Đánh giá và phản hồi
- **NewsArticles**: Tin tức và bài viết
- **Payments**: Thông tin thanh toán
- **Notifications**: Thông báo hệ thống

### **Relationships:**
- User ↔ Booking (1:N)
- User ↔ Review (1:N)
- Service ↔ Booking (1:N)
- Booking ↔ Review (1:1)

---

## 🚀 TÍNH NĂNG NỔI BẬT

### **1. Đặt lịch thông minh**
- Giao diện đặt lịch trực quan, dễ sử dụng
- Tính toán giá tự động theo tham số
- Lưu trữ lịch sử đặt lịch chi tiết

### **2. Quản lý công việc hiệu quả**
- Dashboard thống kê real-time
- Cập nhật trạng thái công việc dễ dàng
- Theo dõi hiệu suất nhân viên

### **3. Hệ thống đánh giá minh bạch**
- Đánh giá 5 sao với nhận xét
- Thống kê điểm số trung bình
- Cải thiện chất lượng dịch vụ

### **4. Quản trị toàn diện**
- Dashboard admin với thống kê chi tiết
- Quản lý người dùng và dịch vụ
- Báo cáo và phân tích dữ liệu

---

## 🔒 BẢO MẬT

### **Authentication & Authorization**
- JWT Bearer Token authentication
- Role-based access control
- Password hashing với BCrypt
- Session management

### **Data Protection**
- Input validation và sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

---

## 📊 HIỆU SUẤT VÀ KHẢ NĂNG MỞ RỘNG

### **Performance**
- Lazy loading cho components
- Image optimization
- API response caching
- Database indexing

### **Scalability**
- Microservices architecture ready
- Horizontal scaling support
- Load balancing capability
- Database sharding ready

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### **Backend Stack**
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Swagger/OpenAPI

### **Frontend Stack**
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form

### **Development Tools**
- Git version control
- ESLint + Prettier
- TypeScript strict mode
- Hot reload development

---

## 📈 ROADMAP PHÁT TRIỂN

### **Phase 1 (Hiện tại)**
- ✅ Hệ thống đặt lịch cơ bản
- ✅ Quản lý người dùng
- ✅ Dashboard admin
- ✅ Hệ thống đánh giá

### **Phase 2 (Tương lai)**
- 🔄 Tích hợp thanh toán online
- 🔄 Ứng dụng mobile (React Native)
- 🔄 Chat support real-time
- 🔄 AI recommendation system

### **Phase 3 (Nâng cao)**
- 📋 IoT integration (smart home)
- 📋 Advanced analytics
- 📋 Multi-language support
- 📋 Franchise management

---

## 📞 LIÊN HỆ VÀ HỖ TRỢ

**Để biết thêm thông tin chi tiết hoặc yêu cầu demo, vui lòng liên hệ:**
- **Email**: support@careu.com
- **Phone**: +84 123 456 789
- **Website**: https://careu.com

---

*© 2024 CareU - Hệ thống quản lý dịch vụ dọn vệ sinh thông minh* 