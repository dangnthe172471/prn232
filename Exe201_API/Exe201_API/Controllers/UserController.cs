using Exe201_API.DTOs;
using Exe201_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Exe201_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "user")]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UserController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var userProfile = await _authService.GetUserProfileAsync(userId);
                return Ok(userProfile);
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

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserProfileUpdateRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var updatedProfile = await _authService.UpdateUserProfileAsync(userId, request);
                return Ok(updatedProfile);
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