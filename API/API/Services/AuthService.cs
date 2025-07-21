using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
	public class AuthService : IAuthService
	{
		private readonly CareUContext _context;
		private readonly JWTConfig _jwtConfig;
		private readonly EmailService _emailService;
		private readonly IConfiguration _config;

		public AuthService(CareUContext context, JWTConfig jwtConfig, EmailService emailService, IConfiguration config)
		{
			_context = context;
			_jwtConfig = jwtConfig;
			_emailService = emailService;
			_config = config;
		}

		public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
		{
			if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
				throw new ArgumentException("Email và mật khẩu không được để trống");

			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
				throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");

			if (!(user.EmailVerified ?? false))
				throw new UnauthorizedAccessException("Tài khoản chưa xác thực email. Vui lòng kiểm tra email để xác thực.");

			var token = _jwtConfig.GenerateJwtToken(user);
			return new LoginResponseDto
			{
				Token = token,
				UserId = user.Id,
				Email = user.Email,
				Name = user.Name,
				Role = user.Role,
				Phone = user.Phone,
				Address = user.Address
			};
		}


		public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
		{
			if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Name))
				throw new ArgumentException("Thông tin đăng ký không hợp lệ");
			if (await _context.Users.AnyAsync(u => u.Email == request.Email))
				throw new ArgumentException("Email đã tồn tại");
			var token = Guid.NewGuid().ToString();
			var user = new User
			{
				Name = request.Name,
				Email = request.Email,
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password), // Note: In a real app, hash this password!
				Phone = request.Phone,
				Address = request.Address,
				Role = request.Role,
				CreatedAt = DateTime.UtcNow,
				EmailVerified = false,
				EmailVerificationToken = token,
				EmailVerificationSentAt = DateTime.UtcNow
			};
			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			// Gửi email xác thực
			await SendVerificationEmailAsync(user, token);
			// Gửi email chào mừng
			await SendWelcomeEmailAsync(user);

			// Không trả token khi chưa xác thực
			return new LoginResponseDto
			{
				Token = null,
				UserId = user.Id,
				Email = user.Email,
				Name = user.Name,
				Role = user.Role,
				Phone = user.Phone,
				Address = user.Address
			};
		}

		public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request)
		{
			if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OldPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
				throw new ArgumentException("Thông tin đổi mật khẩu không hợp lệ");
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
				throw new UnauthorizedAccessException("Email hoặc mật khẩu cũ không đúng");
			user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
			user.UpdatedAt = DateTime.UtcNow;
			_context.Users.Update(user);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<UserProfileResponseDto> GetUserProfileAsync(int userId)
		{
			var user = await _context.Users.FindAsync(userId);
			if (user == null)
			{
				throw new ArgumentException("Không tìm thấy người dùng");
			}

			return new UserProfileResponseDto
			{
				Id = user.Id,
				Name = user.Name,
				Email = user.Email,
				Phone = user.Phone,
				Address = user.Address,
				Role = user.Role,
				Status = user.Status,
				Experience = user.Experience,
				CreatedAt = user.CreatedAt
			};
		}

		public async Task<UserProfileResponseDto> UpdateUserProfileAsync(int userId, UserProfileUpdateRequestDto request)
		{
			var user = await _context.Users.FindAsync(userId);
			if (user == null)
			{
				throw new ArgumentException("Không tìm thấy người dùng");
			}

			user.Name = request.Name;
			user.Phone = request.Phone;
			user.Address = request.Address;
			user.UpdatedAt = DateTime.UtcNow;

			await _context.SaveChangesAsync();

			return await GetUserProfileAsync(userId);
		}

		public async Task<bool> VerifyEmailAsync(string token)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token && (u.EmailVerified == false || u.EmailVerified == null));
			if (user == null)
				return false;
			// Kiểm tra thời hạn 15 phút
			if (!user.EmailVerificationSentAt.HasValue ||
			user.EmailVerificationSentAt.Value.AddMinutes(15) < DateTime.UtcNow)
				return false;

			user.EmailVerified = true;
			user.EmailVerificationToken = null;
			user.EmailVerificationSentAt = null;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> ResendVerificationEmailAsync(string email)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
			if (user == null || (user.EmailVerified ?? false))
				return false;
			user.EmailVerificationToken = Guid.NewGuid().ToString();
			user.EmailVerificationSentAt = DateTime.UtcNow;
			await _context.SaveChangesAsync();
			var verifyUrl = $"{_config["FrontendUrl"]}/verify-email?token={user.EmailVerificationToken}";
			var subject = "Xác thực lại email đăng ký CareU";
			var body = $"<p>Chào {user.Name},</p><p>Vui lòng xác thực email bằng cách nhấn vào link sau:</p><p><a href='{verifyUrl}'>Xác thực email</a></p>";
			await _emailService.SendEmailAsync(user.Email, subject, body);
			return true;
		}
		private async Task SendVerificationEmailAsync(User user, string token)
		{
			var verifyUrl = $"{_config["FrontendUrl"]}/verify-email?token={token}";
			var subject = "Xác thực email đăng ký CareU";
			var body = $@"
            <div style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>
                <div style='max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0002; overflow: hidden;'>
                    <div style='background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); padding: 32px 0 20px 0; text-align: center;'>
                        <img src='https://i.imgur.com/8Km9tLL.png' alt='CareU Logo' style='height: 56px; margin-bottom: 12px;' />
                        <h2 style='color: #fff; margin: 0; font-size: 2rem; letter-spacing: 1px;'>Xác thực email của bạn</h2>
                    </div>
                    <div style='padding: 36px 28px 28px 28px;'>
                        <p style='font-size: 1.15rem; color: #222; margin-bottom: 18px;'>Chào <b>{user.Name}</b>,</p>
                        <p style='color: #444; margin-bottom: 24px;'>Cảm ơn bạn đã đăng ký tài khoản tại <b>CareU</b>!<br>Vui lòng nhấn nút bên dưới để xác thực email và bắt đầu sử dụng dịch vụ.</p>
                        <div style='text-align: center; margin: 36px 0;'>
                            <a href='{verifyUrl}' style='background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 1.15rem; font-weight: bold; display: inline-block; box-shadow: 0 2px 8px #9333ea33;'>Xác thực email</a>
                        </div>
                        <p style='color: #888; font-size: 1rem; margin-bottom: 0;'>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
                        <hr style='margin: 36px 0 16px 0; border: none; border-top: 1px solid #eee;'>
                        <div style='color: #888; font-size: 1rem;'>Trân trọng,<br>Đội ngũ <b>CareU</b></div>
                    </div>
                </div>
            </div>";
			await _emailService.SendEmailAsync(user.Email, subject, body);
		}

		private async Task SendWelcomeEmailAsync(User user)
		{
			var subject = "Chào mừng bạn đến với CareU!";
			var body = $@"
            <div style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>
                <div style='max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0002; overflow: hidden;'>
                    <div style='background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); padding: 32px 0 20px 0; text-align: center;'>
                        <img src='https://i.imgur.com/8Km9tLL.png' alt='CareU Logo' style='height: 56px; margin-bottom: 12px;' />
                        <h2 style='color: #fff; margin: 0; font-size: 2rem; letter-spacing: 1px;'>Chào mừng đến với CareU!</h2>
                    </div>
                    <div style='padding: 36px 28px 28px 28px;'>
                        <p style='font-size: 1.15rem; color: #222; margin-bottom: 18px;'>Xin chào <b>{user.Name}</b>,</p>
                        <p style='color: #444; margin-bottom: 18px;'>Cảm ơn bạn đã đăng ký tài khoản tại <b>CareU</b>!<br>Chúng tôi rất vui được đồng hành cùng bạn trên hành trình chăm sóc tổ ấm.</p>
                        <ul style='color: #444; font-size: 1rem; margin: 16px 0 24px 16px; padding-left: 18px;'>
                            <li>Đặt lịch dọn dẹp nhanh chóng, tiện lợi</li>
                            <li>Đội ngũ nhân viên chuyên nghiệp, tận tâm</li>
                            <li>Ưu đãi hấp dẫn dành riêng cho thành viên mới</li>
                        </ul>
                        <p style='color: #444;'>Hãy xác thực email để bắt đầu sử dụng dịch vụ!</p>
                        <hr style='margin: 36px 0 16px 0; border: none; border-top: 1px solid #eee;'>
                        <div style='color: #888; font-size: 1rem;'>Trân trọng,<br>Đội ngũ <b>CareU</b></div>
                    </div>
                </div>
            </div>";
			await _emailService.SendEmailAsync(user.Email, subject, body);
		}
		private string GeneratePasswordResetPinHtml(string pin, string? userName = null)
		{
			return $@"
    <html>
    <body style='font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;'>
        <div style='max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0002; overflow: hidden;'>
            <div style='background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); padding: 32px 0 20px 0; text-align: center;'>
                <img src='https://i.imgur.com/8Km9tLL.png' alt='CareU Logo' style='height: 56px; margin-bottom: 12px;' />
                <h2 style='color: #fff; margin: 0; font-size: 2rem; letter-spacing: 1px;'>Đặt lại mật khẩu</h2>
            </div>
            <div style='padding: 36px 28px 28px 28px;'>
                <p style='font-size: 1.15rem; color: #222; margin-bottom: 18px;'>
                    {(string.IsNullOrEmpty(userName) ? "" : $"Chào <b>{userName}</b>,<br>")}
                    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <b>CareU</b>.
                </p>
                <div style='background: #f1f5f9; border-radius: 10px; padding: 24px 0; text-align: center; margin: 24px 0;'>
                    <div style='color: #2563eb; font-size: 1.1rem; margin-bottom: 8px;'>Mã PIN đặt lại mật khẩu của bạn:</div>
                    <div style='font-size: 2.2rem; font-weight: bold; letter-spacing: 8px; color: #9333ea;'>{pin}</div>
                </div>
                <p style='color: #dc2626; font-weight: bold; text-align: center; margin-bottom: 18px;'>⚠️ Mã này có hiệu lực trong 15 phút</p>
                <p style='color: #666; font-size: 1rem; text-align: center;'>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <hr style='margin: 36px 0 16px 0; border: none; border-top: 1px solid #eee;'>
                <div style='color: #888; font-size: 1rem; text-align: center;'>Trân trọng,<br>Đội ngũ <b>CareU</b></div>
            </div>
        </div>
    </body>
    </html>";
		}

		public async Task<bool> SendForgotPasswordPinAsync(string email)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
			if (user == null) return false;
			var now = DateTime.UtcNow;
			// Xóa mã PIN cũ chưa dùng hoặc hết hạn
			var oldPins = _context.PasswordResetPins.Where(p => p.Email == email && (p.IsUsed == false || p.IsUsed == null || p.ExpiresAt < now));
			_context.PasswordResetPins.RemoveRange(oldPins);
			// Sinh mã PIN mới
			var pin = new Random().Next(100000, 999999).ToString();
			var pinEntry = new PasswordResetPin
			{
				Email = email,
				Pin = pin,
				CreatedAt = now,
				ExpiresAt = now.AddMinutes(15),
				IsUsed = false
			};
			_context.PasswordResetPins.Add(pinEntry);
			await _context.SaveChangesAsync();
			await _emailService.SendPasswordResetPinEmailAsync(email, pin, user.Name);
			return true;
		}

		public async Task<bool> VerifyForgotPasswordPinAsync(string email, string pin)
		{
			var now = DateTime.UtcNow;
			var pinEntry = await _context.PasswordResetPins.FirstOrDefaultAsync(p => p.Email == email && p.Pin == pin && p.ExpiresAt > now && (p.IsUsed == false || p.IsUsed == null));
			return pinEntry != null;
		}

		public async Task<bool> ResetPasswordWithPinAsync(string email, string pin, string newPassword)
		{
			var now = DateTime.UtcNow;
			var pinEntry = await _context.PasswordResetPins.FirstOrDefaultAsync(p => p.Email == email && p.Pin == pin && p.ExpiresAt > now && (p.IsUsed == false || p.IsUsed == null));
			if (pinEntry == null)
				return false;
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
			if (user == null)
				return false;
			user.Password = newPassword; // Nên hash password ở đây nếu dùng thực tế
			user.UpdatedAt = now;
			pinEntry.IsUsed = true;
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<bool> ResendForgotPasswordPinAsync(string email)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
			if (user == null) return false;
			var now = DateTime.UtcNow;
			var pinEntry = await _context.PasswordResetPins
				.FirstOrDefaultAsync(p => p.Email == email && p.ExpiresAt > now && (p.IsUsed == false || p.IsUsed == null));
			string pin;
			if (pinEntry != null)
			{
				pin = pinEntry.Pin;
				pinEntry.ExpiresAt = now.AddMinutes(15);
				await _context.SaveChangesAsync();
			}
			else
			{
				pin = new Random().Next(100000, 999999).ToString();
				pinEntry = new PasswordResetPin
				{
					Email = email,
					Pin = pin,
					CreatedAt = now,
					ExpiresAt = now.AddMinutes(15),
					IsUsed = false
				};
				_context.PasswordResetPins.Add(pinEntry);
				await _context.SaveChangesAsync();
			}
			await _emailService.SendPasswordResetPinEmailAsync(email, pin, user.Name);
			return true;
		}
	}
}