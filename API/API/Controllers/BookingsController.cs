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
            if (request.ServiceId <= 0)
                return BadRequest(new { message = "ServiceId phải lớn hơn 0" });
            if (request.AreaSizeId <= 0)
                return BadRequest(new { message = "AreaSizeId phải lớn hơn 0" });
            if (request.TimeSlotId <= 0)
                return BadRequest(new { message = "TimeSlotId phải lớn hơn 0" });
            if (request.BookingDate < DateOnly.FromDateTime(DateTime.Now))
                return BadRequest(new { message = "Ngày đặt không được ở quá khứ" });
            if (string.IsNullOrWhiteSpace(request.AddressDistrict))
                return BadRequest(new { message = "Quận/Huyện - Tỉnh/Thành phố không được để trống" });
            if (string.IsNullOrWhiteSpace(request.AddressDetail))
                return BadRequest(new { message = "Địa chỉ chi tiết không được để trống" });
            if (string.IsNullOrWhiteSpace(request.ContactName))
                return BadRequest(new { message = "Tên liên hệ không được để trống" });
            if (string.IsNullOrWhiteSpace(request.ContactPhone))
                return BadRequest(new { message = "Số điện thoại không được để trống" });
            if (request.AddressDistrict.Length > 150)
                return BadRequest(new { message = "Quận/Huyện - Tỉnh/Thành phố tối đa 150 ký tự" });
            if (request.AddressDetail.Length > 200)
                return BadRequest(new { message = "Địa chỉ chi tiết tối đa 200 ký tự" });
            if (request.ContactName.Length > 100)
                return BadRequest(new { message = "Tên liên hệ tối đa 100 ký tự" });
            if (request.Notes != null && request.Notes.Length > 500)
                return BadRequest(new { message = "Ghi chú tối đa 500 ký tự" });
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.ContactPhone, @"^\+?\d{8,15}$"))
                return BadRequest(new { message = "Số điện thoại không hợp lệ" });
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
            var allowedStatuses = new[] { "all", "pending", "confirmed", "in_progress", "completed", "cancelled" };
            if (!string.IsNullOrEmpty(status) && !allowedStatuses.Contains(status.ToLower()))
            {
                return BadRequest(new { message = $"Trạng thái không hợp lệ. Chỉ chấp nhận: {string.Join(", ", allowedStatuses)}" });
            }
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
            if (id <= 0)
            {
                return BadRequest(new { message = "Id không hợp lệ" });
            }
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