using Exe201_API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Exe201_API.Services
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId);
        Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status);
        Task<BookingResponseDto?> GetUserBookingByIdAsync(int bookingId, int userId);
        Task<DashboardStatsDto> GetDashboardStatsAsync(int userId);
        
        // Cleaner methods
        Task<IEnumerable<BookingDetailDto>> GetAvailableJobsAsync();
        Task<IEnumerable<BookingDetailDto>> GetCleanerJobsAsync(int cleanerId, string? status);
        Task<BookingDetailDto> AssignCleanerToBookingAsync(int bookingId, int cleanerId);
        Task<BookingDetailDto> UpdateBookingStatusAsync(int bookingId, string status, int cleanerId);
        Task<CleanerDashboardStatsDto> GetCleanerDashboardStatsAsync(int cleanerId);
    }
} 