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
  Title NVARCHAR(255) NOT NULL,
  Slug NVARCHAR(255) NOT NULL UNIQUE,
  Excerpt NVARCHAR(500),
  Content NVARCHAR(MAX),
  CategoryId INT NOT NULL,
  AuthorId INT NOT NULL,
  PublishDate DATETIME2 NOT NULL,
  ReadTime NVARCHAR(50), -- Ví dụ: "5 phút đọc"
  Views INT DEFAULT 0,
  Likes INT DEFAULT 0,
  Comments INT DEFAULT 0,
  IsFeatured BIT DEFAULT 0,
  ImageUrl NVARCHAR(255),
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

-- Insert dữ liệu mẫu

-- Services
INSERT INTO Services (Name, Description, BasePrice, Duration, Icon) VALUES
(N'Dọn Nhà Định Kỳ', N'Dịch vụ dọn dẹp nhà cửa hàng tuần, hàng tháng với đội ngũ chuyên nghiệp', 300000, N'2-4 giờ', N'🏠'),
(N'Dọn Văn Phòng', N'Vệ sinh văn phòng chuyên nghiệp, tạo môi trường làm việc sạch sẽ', 500000, N'3-5 giờ', N'🏢'),
(N'Dọn Sau Xây Dựng', N'Dọn dẹp chuyên sâu sau khi sửa chữa, xây dựng hoặc cải tạo', 800000, N'4-8 giờ', N'🔨'),
(N'Dọn Cuối Năm', N'Dọn dẹp tổng thể, chuẩn bị đón Tết Nguyên Đán trọn vẹn', 600000, N'4-6 giờ', N'🎊');

-- AreaSizes
INSERT INTO AreaSizes (Name, Multiplier) VALUES
(N'Nhỏ (< 50m²)', 1.0),
(N'Trung bình (50-100m²)', 1.5),
(N'Lớn (100-200m²)', 2.0),
(N'Rất lớn (> 200m²)', 2.5);

-- TimeSlots
INSERT INTO TimeSlots (TimeRange) VALUES
(N'08:00 - 10:00'),
(N'10:00 - 12:00'),
(N'14:00 - 16:00'),
(N'16:00 - 18:00');

-- Demo Users
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, Status) VALUES
(N'Nguyễn Văn A', 'user@demo.com', '123456', '0123456789', N'123 Nguyễn Văn Linh, Q.7, TP.HCM', 'user', 'active'),
(N'Trần Thị B', 'cleaner@demo.com', '123456', '0987654321', N'456 Lê Văn Việt, Q.9, TP.HCM', 'cleaner', 'active'),
(N'Admin', 'admin@demo.com', '123456', '0111222333', N'789 Nguyễn Thị Minh Khai, Q.1, TP.HCM', 'admin', 'active');

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
1, 1, '2024-01-15', N'5 phút đọc', 1250, 89, 23, 1, '/placeholder.svg?height=400&width=800'),

(N'Tác Hại Của Bụi Bẩn Đến Sức Khỏe Gia Đình', 
'tac-hai-cua-bui-ban-den-suc-khoe-gia-dinh', 
N'Tìm hiểu về những tác hại nghiêm trọng của bụi bẩn và cách bảo vệ sức khỏe gia đình bạn...', 
N'<h2>Bụi bẩn không chỉ làm mất thẩm mỹ</h2><p>Bụi bẩn còn ảnh hưởng nghiêm trọng đến sức khỏe, đặc biệt là trẻ em và người già...</p>', 
2, 2, '2024-01-12', N'7 phút đọc', 980, 45, 12, 0, '/placeholder.svg?height=400&width=800'),

(N'CareU Ra Mắt Ứng Dụng Mobile Mới', 
'careu-ra-mat-ung-dung-mobile-moi', 
N'Ứng dụng CareU phiên bản mới với nhiều tính năng thông minh, giúp đặt lịch dễ dàng hơn bao giờ hết...', 
N'<h2>Ứng dụng CareU mới</h2><p>Được tích hợp AI để đề xuất dịch vụ phù hợp và tối ưu hóa lịch trình làm việc...</p>', 
4, 3, '2024-01-10', N'3 phút đọc', 2100, 120, 35, 1, '/placeholder.svg?height=400&width=800'),

(N'Công Nghệ Robot Dọn Dẹp: Tương Lai Đã Đến', 
'cong-nghe-robot-don-dep-tuong-lai-da-den', 
N'Khám phá những công nghệ robot dọn dẹp tiên tiến nhất hiện nay và xu hướng phát triển trong tương lai...', 
N'<h2>Robot dọn dẹp đang trở thành xu hướng mới</h2><p>Giúp tiết kiệm thời gian và nâng cao chất lượng cuộc sống...</p>', 
3, 1, '2024-01-08', N'6 phút đọc', 750, 32, 8, 0, '/placeholder.svg?height=400&width=800'),

(N'Khuyến Mãi Tháng 1: Giảm 30% Dịch Vụ Dọn Cuối Năm', 
'khuyen-mai-thang-1-giam-30-dich-vu-don-cuoi-nam', 
N'Chương trình khuyến mãi đặc biệt dành cho khách hàng mới và cũ trong tháng 1/2024...', 
N'<h2>Nhân dịp đầu năm mới</h2><p>CareU triển khai chương trình khuyến mãi hấp dẫn với mức giảm giá lên đến 30%...</p>', 
5, 3, '2024-01-05', N'2 phút đọc', 3200, 75, 18, 0, '/placeholder.svg?height=400&width=800');

-- NewsArticleTags
INSERT INTO NewsArticleTags (ArticleId, TagId) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Bài 1 với các tags dọn dẹp, mẹo vặt, tiết kiệm thời gian, nhà cửa
(2, 5), (2, 1), (2, 4), -- Bài 2 với các tags sức khỏe, dọn dẹp, nhà cửa
(3, 6), -- Bài 3 với tag công nghệ
(4, 6), (4, 1), -- Bài 4 với tags công nghệ, dọn dẹp
(5, 3), (5, 1); -- Bài 5 với tags tiết kiệm thời gian, dọn dẹp

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