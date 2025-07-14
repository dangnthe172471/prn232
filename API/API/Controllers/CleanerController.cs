using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "cleaner")]
    public class CleanerController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IAuthService _authService;

        public CleanerController(IBookingService bookingService, IAuthService authService)
        {
            _bookingService = bookingService;
            _authService = authService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var cleanerId = GetCurrentUserId();
                var profile = await _authService.GetUserProfileAsync(cleanerId);
                
                if (profile == null)
                {
                    return NotFound(new { message = "Không tìm thấy thông tin cleaner" });
                }

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("available-jobs")]
        public async Task<IActionResult> GetAvailableJobs()
        {
            try
            {
                var jobs = await _bookingService.GetAvailableJobsAsync();
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("my-jobs")]
        public async Task<IActionResult> GetMyJobs([FromQuery] string? status = "all")
        {
            try
            {
                var cleanerId = GetCurrentUserId();
                var jobs = await _bookingService.GetCleanerJobsAsync(cleanerId, status);
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpPost("accept-job/{bookingId}")]
        public async Task<IActionResult> AcceptJob(int bookingId)
        {
            try
            {
                var cleanerId = GetCurrentUserId();
                var result = await _bookingService.AssignCleanerToBookingAsync(bookingId, cleanerId);
                return Ok(result);
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

        [HttpPut("update-job-status/{bookingId}")]
        public async Task<IActionResult> UpdateJobStatus(int bookingId, [FromBody] UpdateJobStatusRequest request)
        {
            try
            {
                var cleanerId = GetCurrentUserId();
                var result = await _bookingService.UpdateBookingStatusAsync(bookingId, request.Status, cleanerId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var cleanerId = GetCurrentUserId();
                var stats = await _bookingService.GetCleanerDashboardStatsAsync(cleanerId);
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