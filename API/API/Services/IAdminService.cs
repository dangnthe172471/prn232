using API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IAdminService
    {
        // Dashboard Statistics
        Task<AdminDashboardStatsDto> GetDashboardStatsAsync();
        
        // Analytics
        Task<IEnumerable<TopCustomerDto>> GetTopCustomersAsync(int limit = 10);
        Task<IEnumerable<TopCleanerDto>> GetTopCleanersAsync(int limit = 10);
        
        // Booking Management
        Task<PagedResult<BookingResponseDto>> GetAllBookingsAsync(int page, int pageSize, string? searchTerm = null, string? status = null);
        Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId);
        Task<BookingResponseDto> UpdateBookingStatusAsync(int bookingId, string status);
        
        // Customer Management
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        
        // Cleaner Management
        Task<IEnumerable<CleanerDto>> GetAllCleanersAsync();
        Task<CleanerDto> UpdateCleanerStatusAsync(int cleanerId, string status);
        
        // Bill Management
        Task<IEnumerable<BillDto>> GetAllBillsAsync();

        // Service Management
        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();
        Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto);
        Task<ServiceDto> UpdateServiceAsync(int id, UpdateServiceDto dto);
        Task<bool> DeleteServiceAsync(int id);
    }
} 