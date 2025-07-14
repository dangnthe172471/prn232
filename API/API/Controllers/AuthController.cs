using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
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

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var result = await _authService.ChangePasswordAsync(request);
                if (result)
                    return Ok(new { message = "Đổi mật khẩu thành công" });
                return BadRequest(new { message = "Đổi mật khẩu thất bại" });
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

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var result = await _authService.VerifyEmailAsync(token);
            if (result)
                return Ok(new { message = "Xác thực email thành công!" });
            return BadRequest(new { message = "Token không hợp lệ hoặc đã xác thực." });
        }

        [HttpPost("resend-verification-email")]
        public async Task<IActionResult> ResendVerificationEmail([FromQuery] string email)
        {
            var result = await _authService.ResendVerificationEmailAsync(email);
            if (result)
                return Ok(new { message = "Đã gửi lại email xác thực!" });
            return BadRequest(new { message = "Không thể gửi lại email xác thực." });
        }

        [HttpPost("forgot-password/send-pin")]
        public async Task<IActionResult> SendForgotPasswordPin([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.SendForgotPasswordPinAsync(request.Email);
            if (result)
                return Ok(new { message = "Đã gửi mã PIN đặt lại mật khẩu tới email!" });
            return BadRequest(new { message = "Không thể gửi mã PIN. Vui lòng kiểm tra lại email." });
        }

        [HttpPost("forgot-password/verify-pin")]
        public async Task<IActionResult> VerifyForgotPasswordPin([FromBody] VerifyPinRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.VerifyForgotPasswordPinAsync(request.Email, request.Pin);
            if (result)
                return Ok(new { message = "Mã PIN hợp lệ!" });
            return BadRequest(new { message = "Mã PIN không hợp lệ hoặc đã hết hạn." });
        }

        [HttpPost("forgot-password/reset")]
        public async Task<IActionResult> ResetPasswordWithPin([FromBody] ResetPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.ResetPasswordWithPinAsync(request.Email, request.Pin, request.NewPassword);
            if (result)
                return Ok(new { message = "Đặt lại mật khẩu thành công!" });
            return BadRequest(new { message = "Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin." });
        }

        [HttpPost("forgot-password/resend-pin")]
        public async Task<IActionResult> ResendForgotPasswordPin([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.ResendForgotPasswordPinAsync(request.Email);
            if (result)
                return Ok(new { message = "Đã gửi lại mã PIN đặt lại mật khẩu tới email!" });
            return BadRequest(new { message = "Không thể gửi lại mã PIN. Vui lòng kiểm tra lại email." });
        }

        [Authorize(Roles = "admin")]
        [HttpGet("test-role-admin")]
        public IActionResult TestRoleAdmin()
        {
            return Ok(new { message = "Bạn có quyền admin" });
        }

        [Authorize(Roles = "user")]
        [HttpGet("test-role-user")]
        public IActionResult TestRoleUser()
        {
            return Ok(new { message = "Bạn có quyền user" });
        }

        [Authorize(Roles = "cleaner")]
        [HttpGet("test-role-cleaner")]
        public IActionResult TestRoleCleaner()
        {
            return Ok(new { message = "Bạn có quyền cleaner" });
        }
    }
} 