using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Services
{
    public class AuthService : IAuthService
    {
        private readonly CareUContext _context;
        private readonly JWTConfig _jwtConfig;

        public AuthService(CareUContext context, JWTConfig jwtConfig)
        {
            _context = context;
            _jwtConfig = jwtConfig;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                throw new ArgumentException("Email và mật khẩu không được để trống");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || user.Password != request.Password)
                throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");

            var token = _jwtConfig.GenerateJwtToken(user);
            return new LoginResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,        // ✅ Thêm
                Address = user.Address     // ✅ Thêm
            };
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Thông tin đăng ký không hợp lệ");
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new ArgumentException("Email đã tồn tại");
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password, // Note: In a real app, hash this password!
                Phone = request.Phone,
                Address = request.Address,
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var token = _jwtConfig.GenerateJwtToken(user);
            return new LoginResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,        // ✅ Thêm
                Address = user.Address     // ✅ Thêm
            };
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OldPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                throw new ArgumentException("Thông tin đổi mật khẩu không hợp lệ");
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || user.Password != request.OldPassword) // Note: In a real app, compare hashed passwords!
                throw new UnauthorizedAccessException("Email hoặc mật khẩu cũ không đúng");
            user.Password = request.NewPassword; // Note: Hash this new password!
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
    }
} 