using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Collections.Generic;

namespace API.Services
{
    public class BookingService : IBookingService
    {
        private readonly CareUContext _context;

        public BookingService(CareUContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId)
        {
            var service = await _context.Services.FindAsync(request.ServiceId);
            if (service == null) throw new ArgumentException("Dịch vụ không tồn tại.");

            var areaSize = await _context.AreaSizes.FindAsync(request.AreaSizeId);
            if (areaSize == null) throw new ArgumentException("Kích thước khu vực không tồn tại.");
            
            var timeSlot = await _context.TimeSlots.FindAsync(request.TimeSlotId);
            if (timeSlot == null) throw new ArgumentException("Khung giờ không tồn tại.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new ArgumentException("Người dùng không tồn tại.");

            var totalPrice = service.BasePrice * areaSize.Multiplier;
            var fullAddress = $"{request.AddressDetail}, {request.AddressDistrict}";

            var booking = new Booking
            {
                UserId = userId,
                ServiceId = request.ServiceId,
                AreaSizeId = request.AreaSizeId,
                TimeSlotId = request.TimeSlotId,
                BookingDate = request.BookingDate,
                Address = fullAddress,
                ContactName = request.ContactName,
                ContactPhone = request.ContactPhone,
                Notes = request.Notes,
                TotalPrice = totalPrice,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            
            return new BookingResponseDto
            {
                Id = booking.Id,
                UserName = user.Name,
                ServiceName = service.Name,
                AreaSizeName = areaSize.Name,
                TimeSlotRange = timeSlot.TimeRange,
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerName = null,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status)
        {
            var query = _context.Bookings
                .Where(b => b.UserId == userId);
            
            if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
            {
                query = query.Where(b => b.Status.ToLower() == status.ToLower());
            }

            return await query
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    UserName = b.User.Name,
                    ServiceName = b.Service.Name,
                    AreaSizeName = b.AreaSize.Name,
                    TimeSlotRange = b.TimeSlot != null ? b.TimeSlot.TimeRange : "Chưa xác định",
                    BookingDate = b.BookingDate,
                    Address = b.Address,
                    ContactName = b.ContactName,
                    ContactPhone = b.ContactPhone,
                    Notes = b.Notes,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CleanerName = b.Cleaner != null ? b.Cleaner.Name : "Chưa có",
                    CreatedAt = b.CreatedAt
                }).ToListAsync();
        }

        public async Task<BookingResponseDto?> GetUserBookingByIdAsync(int bookingId, int userId)
        {
            var booking = await _context.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

            if (booking == null)
            {
                return null;
            }

            return new BookingResponseDto
            {
                Id = booking.Id,
                UserName = booking.User.Name,
                ServiceName = booking.Service.Name,
                AreaSizeName = booking.AreaSize.Name,
                TimeSlotRange = booking.TimeSlot?.TimeRange,
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerName = booking.Cleaner?.Name ?? "Chưa có",
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(int userId)
        {
            var userBookings = _context.Bookings.Where(b => b.UserId == userId);

            var stats = new DashboardStatsDto
            {
                TotalBookings = await userBookings.CountAsync(),
                PendingBookings = await userBookings.CountAsync(b => b.Status.ToLower() == "pending"),
                CompletedBookings = await userBookings.CountAsync(b => b.Status.ToLower() == "completed"),
                TotalSpent = await userBookings.Where(b => b.Status.ToLower() == "completed").SumAsync(b => b.TotalPrice)
            };

            return stats;
        }

        // Cleaner methods
        public async Task<IEnumerable<BookingDetailDto>> GetAvailableJobsAsync()
        {
            return await _context.Bookings
                .Where(b => b.Status.ToLower() == "pending" && b.CleanerId == null)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.User)
                .OrderBy(b => b.BookingDate)
                .Select(b => new BookingDetailDto
                {
                    Id = b.Id,
                    ServiceName = b.Service.Name,
                    AreaSize = b.AreaSize.Name,
                    TimeSlot = b.TimeSlot != null ? b.TimeSlot.TimeRange : "Chưa xác định",
                    BookingDate = b.BookingDate,
                    Address = b.Address,
                    ContactName = b.ContactName,
                    ContactPhone = b.ContactPhone,
                    Notes = b.Notes,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CleanerId = b.CleanerId,
                    CleanerName = b.Cleaner != null ? b.Cleaner.Name : null,
                    CreatedAt = b.CreatedAt ?? DateTime.UtcNow,
                    UpdatedAt = b.UpdatedAt
                }).ToListAsync();
        }

        public async Task<IEnumerable<BookingDetailDto>> GetCleanerJobsAsync(int cleanerId, string? status)
        {
            var query = _context.Bookings
                .Where(b => b.CleanerId == cleanerId);
            
            if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
            {
                query = query.Where(b => b.Status.ToLower() == status.ToLower());
            }

            return await query
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.User)
                .Include(b => b.Cleaner)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingDetailDto
                {
                    Id = b.Id,
                    ServiceName = b.Service.Name,
                    AreaSize = b.AreaSize.Name,
                    TimeSlot = b.TimeSlot != null ? b.TimeSlot.TimeRange : "Chưa xác định",
                    BookingDate = b.BookingDate,
                    Address = b.Address,
                    ContactName = b.ContactName,
                    ContactPhone = b.ContactPhone,
                    Notes = b.Notes,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CleanerId = b.CleanerId,
                    CleanerName = b.Cleaner != null ? b.Cleaner.Name : null,
                    CreatedAt = b.CreatedAt ?? DateTime.UtcNow,
                    UpdatedAt = b.UpdatedAt
                }).ToListAsync();
        }

        public async Task<BookingDetailDto> AssignCleanerToBookingAsync(int bookingId, int cleanerId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.User)
                .Include(b => b.Cleaner)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                throw new ArgumentException("Không tìm thấy booking");

            if (booking.Status.ToLower() != "pending")
                throw new ArgumentException("Booking này không thể được assign");

            if (booking.CleanerId != null)
                throw new ArgumentException("Booking này đã được assign cho cleaner khác");

            var cleaner = await _context.Users.FindAsync(cleanerId);
            if (cleaner == null)
                throw new ArgumentException("Không tìm thấy cleaner");

            booking.CleanerId = cleanerId;
            booking.Status = "confirmed";
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BookingDetailDto
            {
                Id = booking.Id,
                ServiceName = booking.Service.Name,
                AreaSize = booking.AreaSize.Name,
                TimeSlot = booking.TimeSlot != null ? booking.TimeSlot.TimeRange : "Chưa xác định",
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerId = booking.CleanerId,
                CleanerName = cleaner.Name,
                CreatedAt = booking.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = booking.UpdatedAt
            };
        }

        public async Task<BookingDetailDto> UpdateBookingStatusAsync(int bookingId, string status, int cleanerId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.User)
                .Include(b => b.Cleaner)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                throw new ArgumentException("Không tìm thấy booking");

            if (booking.CleanerId != cleanerId)
                throw new UnauthorizedAccessException("Bạn không có quyền cập nhật booking này");

            // Validate status transition
            var currentStatus = booking.Status.ToLower();
            var newStatus = status.ToLower();

            if (!IsValidStatusTransition(currentStatus, newStatus))
                throw new ArgumentException($"Không thể chuyển từ trạng thái '{currentStatus}' sang '{newStatus}'");

            booking.Status = newStatus;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BookingDetailDto
            {
                Id = booking.Id,
                ServiceName = booking.Service.Name,
                AreaSize = booking.AreaSize.Name,
                TimeSlot = booking.TimeSlot != null ? booking.TimeSlot.TimeRange : "Chưa xác định",
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerId = booking.CleanerId,
                CleanerName = booking.Cleaner != null ? booking.Cleaner.Name : null,
                CreatedAt = booking.CreatedAt ?? DateTime.UtcNow,
                UpdatedAt = booking.UpdatedAt
            };
        }

        public async Task<CleanerDashboardStatsDto> GetCleanerDashboardStatsAsync(int cleanerId)
        {
            var allBookings = _context.Bookings.Where(b => b.CleanerId == cleanerId);
            var availableJobs = _context.Bookings.Where(b => b.Status.ToLower() == "pending" && b.CleanerId == null);

            var stats = new CleanerDashboardStatsDto
            {
                AvailableJobs = await availableJobs.CountAsync(),
                MyJobs = await allBookings.CountAsync(),
                CompletedJobs = await allBookings.CountAsync(b => b.Status.ToLower() == "completed"),
                TotalEarnings = await allBookings.Where(b => b.Status.ToLower() == "completed").SumAsync(b => b.TotalPrice),
                PendingJobs = await allBookings.CountAsync(b => b.Status.ToLower() == "confirmed"),
                InProgressJobs = await allBookings.CountAsync(b => b.Status.ToLower() == "in_progress")
            };

            return stats;
        }

        public async Task<bool> CancelBookingByUserAsync(int bookingId, int userId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);
            if (booking == null)
                throw new ArgumentException("Không tìm thấy đơn hàng hoặc bạn không có quyền.");
            if (booking.Status != "pending")
                throw new ArgumentException("Chỉ có thể hủy đơn ở trạng thái pending.");
            booking.Status = "cancelled";
            booking.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        private bool IsValidStatusTransition(string currentStatus, string newStatus)
        {
            return (currentStatus, newStatus) switch
            {
                ("confirmed", "in_progress") => true,
                ("in_progress", "completed") => true,
                ("in_progress", "cancelled") => true,
                ("confirmed", "cancelled") => true,
                _ => false
            };
        }
    }
} 