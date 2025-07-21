using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class AdminService : IAdminService
    {
        private readonly CareUContext _context;

        public AdminService(CareUContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.UtcNow;

            var stats = new AdminDashboardStatsDto
            {
                TotalCustomers = await _context.Users.CountAsync(u => u.Role == "user"),
                TotalCleaners = await _context.Users.CountAsync(u => u.Role == "cleaner"),
                TotalBookings = await _context.Bookings.CountAsync(),
                TotalRevenue = await _context.Bookings.Where(b => b.Status == "completed").SumAsync(b => b.TotalPrice),
                TotalBills = await _context.Payments.CountAsync(),
                PendingCleaners = await _context.Users.CountAsync(u => u.Role == "cleaner" && u.Status == "pending"),
                ActiveCleaners = await _context.Users.CountAsync(u => u.Role == "cleaner" && u.Status == "active"),
                RecentBookings = await _context.Bookings.CountAsync(),
                RecentRevenue = await _context.Bookings
                    .Where(b => b.Status == "completed")
                    .SumAsync(b => b.TotalPrice)
            };

            var statuses = new[] { "pending", "confirmed", "in_progress", "completed", "cancelled" };
            foreach (var status in statuses)
            {
                stats.BookingsByStatus[status] = await _context.Bookings.CountAsync(b => b.Status == status);
            }

            var serviceTypes = await _context.Services.Select(s => s.Name).ToListAsync();
            foreach (var serviceType in serviceTypes)
            {
                var revenue = await _context.Bookings
                    .Where(b => b.Service.Name == serviceType && b.Status == "completed")
                    .SumAsync(b => b.TotalPrice);
                stats.RevenueByService[serviceType] = revenue;
            }

            return stats;
        }

        public async Task<PagedResult<BookingResponseDto>> GetAllBookingsAsync(int page, int pageSize, string? searchTerm = null, string? status = null)
        {
            var query = _context.Bookings.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(b => 
                    b.ContactName.Contains(searchTerm) || 
                    b.Address.Contains(searchTerm) || 
                    b.Id.ToString().Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(status) && status != "all")
            {
                query = query.Where(b => b.Status == status);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    UserName = b.User.Name,
                    ServiceName = b.Service.Name,
                    AreaSizeName = b.AreaSize.Name,
                    TimeSlotRange = b.TimeSlot != null ? b.TimeSlot.TimeRange : null,
                    BookingDate = b.BookingDate,
                    Address = b.Address,
                    ContactName = b.ContactName,
                    ContactPhone = b.ContactPhone,
                    Notes = b.Notes,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CleanerName = b.Cleaner != null ? b.Cleaner.Name : null,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            return new PagedResult<BookingResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) return null;

            return new BookingResponseDto
            {
                Id = booking.Id,
                UserName = booking.User.Name,
                ServiceName = booking.Service.Name,
                AreaSizeName = booking.AreaSize.Name,
                TimeSlotRange = booking.TimeSlot != null ? booking.TimeSlot.TimeRange : null,
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerName = booking.Cleaner != null ? booking.Cleaner.Name : null,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<BookingResponseDto> UpdateBookingStatusAsync(int bookingId, string status)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                throw new ArgumentException("Không tìm thấy booking");

            booking.Status = status;
            booking.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new BookingResponseDto
            {
                Id = booking.Id,
                UserName = booking.User.Name,
                ServiceName = booking.Service.Name,
                AreaSizeName = booking.AreaSize.Name,
                TimeSlotRange = booking.TimeSlot != null ? booking.TimeSlot.TimeRange : null,
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerName = booking.Cleaner != null ? booking.Cleaner.Name : null,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "user")
                .Select(u => new CustomerDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Status = u.Status ?? "Active",
                    CreatedAt = u.CreatedAt,
                    TotalBookings = u.BookingUsers.Count,
                    TotalSpent = u.BookingUsers.Where(b => b.Status == "completed").Sum(b => b.TotalPrice)
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CleanerDto>> GetAllCleanersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "cleaner")
                .Select(u => new CleanerDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Experience = u.Experience,
                    Status = u.Status ?? "pending",
                    CreatedAt = u.CreatedAt,
                    TotalJobs = u.BookingCleaners.Count,
                    CompletedJobs = u.BookingCleaners.Count(b => b.Status == "completed"),
                    TotalEarnings = u.BookingCleaners.Where(b => b.Status == "completed").Sum(b => b.TotalPrice)
                })
                .ToListAsync();
        }

        public async Task<CleanerDto> UpdateCleanerStatusAsync(int cleanerId, string status)
        {
            var cleaner = await _context.Users.FirstOrDefaultAsync(u => u.Id == cleanerId && u.Role == "cleaner");
            if (cleaner == null)
                throw new ArgumentException("Không tìm thấy cleaner");

            cleaner.Status = status;
            cleaner.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new CleanerDto
            {
                Id = cleaner.Id,
                Name = cleaner.Name,
                Email = cleaner.Email,
                Phone = cleaner.Phone,
                Address = cleaner.Address,
                Experience = cleaner.Experience,
                Status = cleaner.Status ?? "pending",
                CreatedAt = cleaner.CreatedAt,
                TotalJobs = cleaner.BookingCleaners.Count,
                CompletedJobs = cleaner.BookingCleaners.Count(b => b.Status == "completed"),
                TotalEarnings = cleaner.BookingCleaners.Where(b => b.Status == "completed").Sum(b => b.TotalPrice)
            };
        }

        public async Task<IEnumerable<BillDto>> GetAllBillsAsync()
        {
            return await _context.Payments
                .Select(p => new BillDto
                {
                    Id = p.Id,
                    BillId = p.Id.ToString("D5"), // Format as 00001, 00002, etc.
                    CustomerEmail = p.Booking.User.Email,
                    Amount = p.Amount,
                    Status = p.PaymentStatus ?? "N/A",
                    Date = p.PaidAt ?? p.CreatedAt ?? DateTime.MinValue,
                    CreatedAt = p.CreatedAt
                })
                .OrderByDescending(b => b.Date)
                .ToListAsync();
        }
    }
} 