using Exe201_API.DTOs;
using Exe201_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Exe201_API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // Dashboard Statistics
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _adminService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // Booking Management
        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            try
            {
                var result = await _adminService.GetAllBookingsAsync(page, pageSize, search, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("bookings/{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            try
            {
                var booking = await _adminService.GetBookingByIdAsync(id);
                if (booking == null)
                    return NotFound(new { message = "Không tìm thấy booking" });

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpPut("bookings/{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusRequest request)
        {
            try
            {
                var booking = await _adminService.UpdateBookingStatusAsync(id, request.Status);
                return Ok(booking);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // Customer Management
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _adminService.GetAllCustomersAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // Cleaner Management
        [HttpGet("cleaners")]
        public async Task<IActionResult> GetAllCleaners()
        {
            try
            {
                var cleaners = await _adminService.GetAllCleanersAsync();
                return Ok(cleaners);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpPut("cleaners/{id}/status")]
        public async Task<IActionResult> UpdateCleanerStatus(int id, [FromBody] UpdateCleanerStatusRequest request)
        {
            try
            {
                var cleaner = await _adminService.UpdateCleanerStatusAsync(id, request.Status);
                return Ok(cleaner);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // Bill Management
        [HttpGet("bills")]
        public async Task<IActionResult> GetAllBills()
        {
            try
            {
                var bills = await _adminService.GetAllBillsAsync();
                return Ok(bills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }
    }

    public class UpdateBookingStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateCleanerStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
} 