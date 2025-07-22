-- Tạo database CareU
CREATE DATABASE CareU;
GO

USE CareU;
GO

-- Bảng Users (Người dùng)
CREATE TABLE Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Email NVARCHAR(100) UNIQUE NOT NULL,
  Password NVARCHAR(255) NOT NULL,
  Phone NVARCHAR(20) NOT NULL,
  Address NVARCHAR(255) NOT NULL,
  Role NVARCHAR(20) NOT NULL CHECK (Role IN ('user', 'cleaner', 'admin')),
  Status NVARCHAR(20) DEFAULT 'active' CHECK (Status IN ('active', 'pending', 'inactive')),
  Experience NVARCHAR(50) NULL, -- Chỉ cho cleaner
  EmailVerified BIT DEFAULT 0, -- Đã xác thực email hay chưa
  EmailVerificationToken NVARCHAR(MAX), -- Mã xác thực email
  EmailVerificationSentAt DATETIME2, -- Thời điểm gửi mã xác thực
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng Services (Dịch vụ)
CREATE TABLE Services (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Description NVARCHAR(500),
  BasePrice DECIMAL(10,2) NOT NULL,
  Duration NVARCHAR(50), -- VD: "2-4 giờ"
  Icon NVARCHAR(10), -- Emoji icon
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng AreaSizes (Kích thước diện tích)
CREATE TABLE AreaSizes (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL, -- VD: "Nhỏ (< 50m²)"
  Multiplier DECIMAL(3,2) NOT NULL, -- Hệ số nhân giá
  IsActive BIT DEFAULT 1
);

-- Bảng TimeSlots (Khung giờ làm việc)
CREATE TABLE TimeSlots (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  TimeRange NVARCHAR(50) NOT NULL, -- VD: "08:00 - 10:00"
  IsActive BIT DEFAULT 1
);

-- Bảng Bookings (Đặt lịch)
CREATE TABLE Bookings (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  UserId INT NOT NULL,
  ServiceId INT NOT NULL,
  AreaSizeId INT NOT NULL,
  TimeSlotId INT NULL,
  CleanerId INT NULL,
  BookingDate DATE NOT NULL,
  Address NVARCHAR(255) NOT NULL,
  ContactName NVARCHAR(100) NOT NULL,
  ContactPhone NVARCHAR(20) NOT NULL,
  Notes NVARCHAR(500),
  TotalPrice DECIMAL(10,2) NOT NULL,
  Status NVARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (ServiceId) REFERENCES Services(Id),
  FOREIGN KEY (AreaSizeId) REFERENCES AreaSizes(Id),
  FOREIGN KEY (TimeSlotId) REFERENCES TimeSlots(Id),
  FOREIGN KEY (CleanerId) REFERENCES Users(Id)
);

-- Bảng Reviews (Đánh giá)
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

-- Bảng Payments (Thanh toán)
CREATE TABLE Payments (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  BookingId INT NOT NULL,
  Amount DECIMAL(10,2) NOT NULL,
  PaymentMethod NVARCHAR(50), -- VD: "cash", "card", "transfer"
  PaymentStatus NVARCHAR(20) DEFAULT 'pending' CHECK (PaymentStatus IN ('pending', 'completed', 'failed')),
  TransactionId NVARCHAR(100),
  PaidAt DATETIME2,
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Bảng Notifications (Thông báo)
CREATE TABLE Notifications (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  UserId INT NOT NULL,
  Title NVARCHAR(200) NOT NULL,
  Message NVARCHAR(500) NOT NULL,
  Type NVARCHAR(50), -- VD: "booking", "payment", "system"
  IsRead BIT DEFAULT 0,
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Bảng NewsCategories (Danh mục tin tức)
CREATE TABLE NewsCategories (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Slug NVARCHAR(100) NOT NULL UNIQUE,
  ColorClass NVARCHAR(100), -- Lưu class CSS cho màu sắc
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng NewsArticles (Bài viết tin tức)
CREATE TABLE NewsArticles (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Title NVARCHAR(MAX) NOT NULL,
  Slug NVARCHAR(255) NOT NULL UNIQUE,
  Excerpt NVARCHAR(MAX),
  Content NVARCHAR(MAX),
  CategoryId INT NOT NULL,
  AuthorId INT NOT NULL,
  PublishDate DATETIME2 NOT NULL,
  ReadTime NVARCHAR(50), -- Ví dụ: "5 phút đọc"
  Views INT DEFAULT 0,
  Likes INT DEFAULT 0,
  Comments INT DEFAULT 0,
  IsFeatured BIT DEFAULT 0,
  ImageUrl NVARCHAR(MAX),
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME2 DEFAULT GETDATE(),
  UpdatedAt DATETIME2 DEFAULT GETDATE(),
  
  FOREIGN KEY (CategoryId) REFERENCES NewsCategories(Id),
  FOREIGN KEY (AuthorId) REFERENCES Users(Id)
);

-- Bảng NewsTags (Tags cho bài viết)
CREATE TABLE NewsTags (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Slug NVARCHAR(100) NOT NULL UNIQUE
);

-- Bảng trung gian để liên kết Articles và Tags (many-to-many)
CREATE TABLE NewsArticleTags (
  ArticleId INT NOT NULL,
  TagId INT NOT NULL,
  PRIMARY KEY (ArticleId, TagId),
  
  FOREIGN KEY (ArticleId) REFERENCES NewsArticles(Id) ON DELETE CASCADE,
  FOREIGN KEY (TagId) REFERENCES NewsTags(Id) ON DELETE CASCADE
);

-- Bảng PasswordResetPin (Mã PIN đặt lại mật khẩu)
CREATE TABLE PasswordResetPins (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(100) NOT NULL,
  Pin NVARCHAR(6) NOT NULL,
  CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
  ExpiresAt DATETIME2 NOT NULL,
  IsUsed BIT DEFAULT 0,
);

-- Insert dữ liệu mẫu

-- Services
INSERT INTO Services (Name, Description, BasePrice, Duration, Icon) VALUES
(N'Dọn Nhà Định Kỳ', N'Dịch vụ dọn dẹp nhà cửa định kỳ với đội ngũ chuyên nghiệp', 80000, N'2-4 giờ', N'🏠'),
(N'Dọn Nhà Và Chuyển Phòng', N'Dọn dẹp nhà cửa, hỗ trợ chuyển phòng, sắp xếp đồ đạc', 120000, N'3-5 giờ', N'🚚'),
(N'Dọn Phòng Sau Xây Dựng', N'Dọn dẹp chuyên sâu sau khi sửa chữa, xây dựng hoặc cải tạo', 150000, N'4-8 giờ', N'🔨');

-- AreaSizes
INSERT INTO AreaSizes (Name, Multiplier) VALUES
(N'Nhỏ (< 25m²)', 1.5),
(N'Trung bình (25-50m²)', 2.0),
(N'Lớn (50-100m²)', 3.0),
(N'Rất lớn (> 100m²)', 5.0);

-- TimeSlots
INSERT INTO TimeSlots (TimeRange) VALUES
(N'08:00 - 10:00'),
(N'10:00 - 12:00'),
(N'14:00 - 16:00'),
(N'16:00 - 18:00');

-- Admin
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, Status, EmailVerified) VALUES
(N'Admin', 'admin@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0901122334', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', 'admin', 'active', 1);

-- 4 Cleaners
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, Status,Experience, EmailVerified)
VALUES
(N'Trần Trang', 'ntmtrang123@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0904567890', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', 'cleaner', 'active',N'Dưới 1 năm', 1),
(N'Lê Tường Vy', 'letuongvy1806@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0812340986', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', 'cleaner', 'active','1-3 năm', 1),
(N'Nguyễn Hoàng Anh', 'nguyenhoanganh2n6@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0398765431', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', 'cleaner', 'active',N'1-3 năm', 1),
(N'Nguyễn Thu Trang', 'ntmtrang126@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '09$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK71', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', 'cleaner', 'active',N'Dưới 1 năm', 1);

-- 21 Users (role: user)
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, Status, EmailVerified)
VALUES
(N'Nguyễn Đức Tâm', 'nguyenductammdsl@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '090$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK7', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Nam Khánh', 'namkhanhdz123@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '08$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK78', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Quý', 'quy77889@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0398765432', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Nguyễn Quang Vinh', 'nguyenquangvinhzz@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '09$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK78', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Huỳnh Thái Khang', 'huynhthaikhang@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0898765432', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Đạt', 'dat8948@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0387654321', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Thanh D', 'thanhd2006@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0909876543', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Hinh Võ', 'hinhvomkmv1987az@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0810987654', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'King PvP', 'kingpvpfa2006@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0390$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Võ Nhật Duy', 'vonhatduy07082k6@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0910987654', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Tiến Nhiên', 'tiennhien2k6@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0890$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Ngô Khang', 'ngkhang2002zz@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0389012345', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Văn Linh', 'vanlinh2k666@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0902345678', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Ngô Thảo Nguyên', 'ngthaonguyen77@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0812340987', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Văn Ách', 'vnaxkonchiem111@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0398760123', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Thắng Nghiêm', 'thangnghiem1964@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0912340987', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Văn Zlinh', 'vanzlinh@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0898760123', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Holy Alone', 'holyalone123@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0387650987', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Tân Đạt', 'tandat193@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0903456789', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Nguyễn Hoàng Anh', 'nguyenhoanganh2n7@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '08$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK70', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1),
(N'Nguyễn Trang', 'ntmtrang129@gmail.com', '$2a$11$DkrieekTaVPOPWNorE3Ev.82Ll6zA72u/Xya/GwnHHs2r2DLdD0zK', '0390123478', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', 'user', 'active', 1);

-- NewsCategories
INSERT INTO NewsCategories (Name, Slug, ColorClass) VALUES
(N'Mẹo vặt', 'tips', 'bg-blue-100 text-blue-700'),
(N'Sức khỏe', 'health', 'bg-green-100 text-green-700'),
(N'Công nghệ', 'technology', 'bg-purple-100 text-purple-700'),
(N'Tin công ty', 'company', 'bg-orange-100 text-orange-700'),
(N'Khuyến mãi', 'promotion', 'bg-red-100 text-red-700');

-- NewsTags
INSERT INTO NewsTags (Name, Slug) VALUES
(N'dọn dẹp', 'don-dep'),
(N'mẹo vặt', 'meo-vat'),
(N'tiết kiệm thời gian', 'tiet-kiem-thoi-gian'),
(N'nhà cửa', 'nha-cua'),
(N'sức khỏe', 'suc-khoe'),
(N'công nghệ', 'cong-nghe');

-- NewsArticles
INSERT INTO NewsArticles (Title, Slug, Excerpt, Content, CategoryId, AuthorId, PublishDate, ReadTime, Views, Likes, Comments, IsFeatured, ImageUrl) VALUES
(N'10 Mẹo Dọn Nhà Nhanh Chóng Và Hiệu Quả', 
'10-meo-don-nha-nhanh-chong-va-hieu-qua', 
N'Khám phá những bí quyết giúp bạn dọn dẹp nhà cửa một cách nhanh chóng và tiết kiệm thời gian...', 
N'<h2>Dọn dẹp nhà cửa không cần phải mất cả ngày</h2><p>Với những mẹo hay này, bạn có thể có một ngôi nhà sạch sẽ chỉ trong vài giờ...</p>', 
1, 1, '2025-05-29', N'5 phút đọc', 1250, 89, 23, 1, '/placeholder.svg?height=400&width=800'),

(N'Tác Hại Của Bụi Bẩn Đến Sức Khỏe Gia Đình', 
'tac-hai-cua-bui-ban-den-suc-khoe-gia-dinh', 
N'Tìm hiểu về những tác hại nghiêm trọng của bụi bẩn và cách bảo vệ sức khỏe gia đình bạn...', 
N'<h2>Bụi bẩn không chỉ làm mất thẩm mỹ</h2><p>Bụi bẩn còn ảnh hưởng nghiêm trọng đến sức khỏe, đặc biệt là trẻ em và người già...</p>', 
2, 2, '2025-06-06', N'7 phút đọc', 980, 45, 12, 0, '/placeholder.svg?height=400&width=800'),

(N'CareU Ra Mắt Ứng Dụng Mobile Mới', 
'careu-ra-mat-ung-dung-mobile-moi', 
N'Ứng dụng CareU phiên bản mới với nhiều tính năng thông minh, giúp đặt lịch dễ dàng hơn bao giờ hết...', 
N'<h2>Ứng dụng CareU mới</h2><p>Được tích hợp AI để đề xuất dịch vụ phù hợp và tối ưu hóa lịch trình làm việc...</p>', 
4, 3, '2025-06-13', N'3 phút đọc', 2100, 120, 35, 1, '/placeholder.svg?height=400&width=800'),

(N'Công Nghệ Robot Dọn Dẹp: Tương Lai Đã Đến', 
'cong-nghe-robot-don-dep-tuong-lai-da-den', 
N'Khám phá những công nghệ robot dọn dẹp tiên tiến nhất hiện nay và xu hướng phát triển trong tương lai...', 
N'<h2>Robot dọn dẹp đang trở thành xu hướng mới</h2><p>Giúp tiết kiệm thời gian và nâng cao chất lượng cuộc sống...</p>', 
3, 1, '2024-06-20', N'6 phút đọc', 750, 32, 8, 0, '/placeholder.svg?height=400&width=800'),

(N'Khuyến Mãi Tháng 1: Giảm 30% Dịch Vụ Dọn Cuối Năm', 
'khuyen-mai-thang-1-giam-30-dich-vu-don-cuoi-nam', 
N'Chương trình khuyến mãi đặc biệt dành cho khách hàng mới và cũ trong tháng 1/2024...', 
N'<h2>Nhân dịp đầu năm mới</h2><p>CareU triển khai chương trình khuyến mãi hấp dẫn với mức giảm giá lên đến 30%...</p>', 
5, 3, '2025-06-28', N'2 phút đọc', 3200, 75, 18, 0, '/placeholder.svg?height=400&width=800');

-- NewsArticleTags
INSERT INTO NewsArticleTags (ArticleId, TagId) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Bài 1 với các tags dọn dẹp, mẹo vặt, tiết kiệm thời gian, nhà cửa
(2, 5), (2, 1), (2, 4), -- Bài 2 với các tags sức khỏe, dọn dẹp, nhà cửa
(3, 6), -- Bài 3 với tag công nghệ
(4, 6), (4, 1), -- Bài 4 với tags công nghệ, dọn dẹp
(5, 3), (5, 1); -- Bài 5 với tags tiết kiệm thời gian, dọn dẹp

-- Bookings
INSERT INTO Bookings (UserId, ServiceId, AreaSizeId, TimeSlotId, CleanerId, BookingDate, Address, ContactName, ContactPhone, Notes, TotalPrice, Status)
VALUES
(6, 1, 1, 1, 2, '2025-05-29', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', N'Nguyễn Đức Tâm', '0901234567', NULL, 120000, 'completed'),
(7, 1, 1, 1, 3, '2025-05-30', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', N'Nam Khánh', '0812345678', NULL, 120000, 'completed'),
(8, 1, 2, 1, 4, '2025-05-31', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', N'Quý', '0398765432', NULL, 160000, 'completed'),
(9, 1, 1, 1, 5, '2025-06-01', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', N'Nguyễn Quang Vinh', '0912345678', NULL, 120000, 'completed'),
(10, 1, 1, 1, 2, '2025-06-02', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', N'Huỳnh Thái Khang', '0898765432', NULL, 120000, 'completed'),
(11, 1, 1, 1, 3, '2025-06-03', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', N'Đạt', '0387654321', NULL, 120000, 'completed'),
(12, 1, 2, 1, 4, '2025-06-07', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', N'Thanh D', '0909876543', NULL, 160000, 'completed'),
(13, 1, 2, 1, 5, '2025-06-07', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', N'Hinh Võ', '0810987654', NULL, 160000, 'completed'),
(14, 1, 1, 1, 2, '2025-06-07', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', N'King PvP', '0390123456', NULL, 120000, 'completed'),
(15, 1, 2, 1, 3, '2025-06-08', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', N'Võ Nhật Duy', '0910987654', NULL, 160000, 'completed'),
(16, 1, 2, 1, 4, '2025-06-08', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', N'Tiến Nhiên', '0890123456', NULL, 160000, 'completed'),
(17, 1, 1, 1, 5, '2025-06-09', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', N'Ngô Khang', '0389012345', NULL, 120000, 'completed'),
(18, 1, 2, 1, 2, '2025-06-10', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', N'Văn Linh', '0902345678', NULL, 160000, 'completed'),
(19, 1, 1, 1, 3, '2025-06-11', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', N'Ngô Thảo Nguyên', '0812340987', NULL, 120000, 'completed'),
(20, 1, 2, 1, 4, '2025-06-14', N'Thôn 1, Thạch Hòa, Thạch Thất, Hà Nội', N'Văn Ách', '0398760123', NULL, 160000, 'completed'),
(21, 1, 2, 1, 5, '2025-06-14', N'Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội', N'Thắng Nghiêm', '0912340987', NULL, 160000, 'completed'),
(22, 1, 2, 1, 2, '2025-06-14', N'Thôn 3, Thạch Hòa, Thạch Thất, Hà Nội', N'Văn Zlinh', '0898760123', NULL, 160000, 'completed'),
(23, 1, 1, 1, 3, '2025-06-15', N'Thôn 4, Thạch Hòa, Thạch Thất, Hà Nội', N'Holy Alone', '0387650987', NULL, 120000, 'completed'),
(24, 1, 4, 1, 4, '2025-06-15', N'Phú Mỹ, Thạch Hòa, Thạch Thất, Hà Nội', N'Tân Đạt', '0903456789', NULL, 400000, 'completed'),
(25, 1, 2, 1, 5, '2025-06-15', N'Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội', N'Nguyễn Hoàng Anh', '0812345670', NULL, 160000, 'completed'),
(26, 1, 2, 1, 2, '2025-06-18', N'Phú Hữu, Thạch Hòa, Thạch Thất, Hà Nội', N'Nguyễn Trang', '0390123478', NULL, 160000, 'completed');

-- Indexes để tối ưu performance
CREATE INDEX IX_Bookings_UserId ON Bookings(UserId);
CREATE INDEX IX_Bookings_CleanerId ON Bookings(CleanerId);
CREATE INDEX IX_Bookings_Status ON Bookings(Status);
CREATE INDEX IX_Bookings_BookingDate ON Bookings(BookingDate);
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_NewsArticles_CategoryId ON NewsArticles(CategoryId);
CREATE INDEX IX_NewsArticles_PublishDate ON NewsArticles(PublishDate);
CREATE INDEX IX_NewsArticles_IsFeatured ON NewsArticles(IsFeatured);


-- Indexes cho PasswordResetPin
CREATE INDEX IX_PasswordResetPins_Email ON PasswordResetPins(Email);
CREATE INDEX IX_PasswordResetPins_ExpiresAt ON PasswordResetPins(ExpiresAt);