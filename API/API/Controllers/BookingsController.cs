using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("Không tìm thấy thông tin người dùng từ token.");
                }

                if (!int.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized("ID người dùng trong token không hợp lệ.");
                }

                var result = await _bookingService.CreateBookingAsync(request, userId);
                return CreatedAtAction(nameof(CreateBooking), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> GetUserBookings([FromQuery] string? status = "all")
        {
            try
            {
                var userId = GetCurrentUserId();
                var bookings = await _bookingService.GetUserBookingsAsync(userId, status);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> GetBookingByIdForUser(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var booking = await _bookingService.GetUserBookingByIdAsync(id, userId);
                if (booking == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập." });
                }
                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("dashboard-stats")]
        [Authorize(Roles = "user")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                var stats = await _bookingService.GetDashboardStatsAsync(userId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }
        
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                throw new UnauthorizedAccessException("ID người dùng không hợp lệ hoặc không tìm thấy.");
            }
            return userId;
        }
    }
} 