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

        // Service Management
        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            return await _context.Services
                .Select(s => new ServiceDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    BasePrice = s.BasePrice,
                    Duration = s.Duration,
                    Icon = s.Icon,
                    IsActive = s.IsActive ?? true,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto)
        {
            var service = new Models.Service
            {
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                Duration = dto.Duration,
                Icon = dto.Icon,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                BasePrice = service.BasePrice,
                Duration = service.Duration,
                Icon = service.Icon,
                IsActive = service.IsActive ?? true,
                CreatedAt = service.CreatedAt
            };
        }

        public async Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) throw new ArgumentException("Không tìm thấy dịch vụ");
            service.Name = dto.Name;
            service.Description = dto.Description;
            service.BasePrice = dto.BasePrice;
            service.Duration = dto.Duration;
            service.Icon = dto.Icon;
            service.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return new ServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                BasePrice = service.BasePrice,
                Duration = service.Duration,
                Icon = service.Icon,
                IsActive = service.IsActive ?? true,
                CreatedAt = service.CreatedAt
            };
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return false;
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }

        // Analytics
        public async Task<IEnumerable<TopCustomerDto>> GetTopCustomersAsync(int limit = 10)
        {
            return await _context.Users
                .Where(u => u.Role == "user")
                .Select(u => new TopCustomerDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    TotalBookings = u.Bookings.Count(),
                    TotalSpent = u.Bookings.Where(b => b.Status == "completed").Sum(b => b.TotalPrice),
                    LastBookingDate = u.Bookings.OrderByDescending(b => b.CreatedAt).FirstOrDefault().CreatedAt ?? DateTime.MinValue,
                    CreatedAt = u.CreatedAt
                })
                .Where(c => c.TotalBookings > 0)
                .OrderByDescending(c => c.TotalBookings)
                .ThenByDescending(c => c.TotalSpent)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<IEnumerable<TopCleanerDto>> GetTopCleanersAsync(int limit = 10)
        {
            return await _context.Users
                .Where(u => u.Role == "cleaner")
                .Select(u => new TopCleanerDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    TotalBookings = u.BookingCleaners.Count(),
                    CompletedBookings = u.BookingCleaners.Where(b => b.Status == "completed").Count(),
                    TotalEarnings = u.BookingCleaners.Where(b => b.Status == "completed").Sum(b => b.TotalPrice),
                    AverageRating = u.BookingCleaners
                        .Where(b => b.Status == "completed" && b.Reviews.Any())
                        .SelectMany(b => b.Reviews)
                        .Average(r => r.Rating) ?? 0,
                    LastBookingDate = u.BookingCleaners.OrderByDescending(b => b.CreatedAt).FirstOrDefault().CreatedAt ?? DateTime.MinValue,
                    CreatedAt = u.CreatedAt
                })
                .Where(c => c.TotalBookings > 0)
                .OrderByDescending(c => c.CompletedBookings)
                .ThenByDescending(c => c.TotalEarnings)
                .Take(limit)
                .ToListAsync();
        }
    }
} 