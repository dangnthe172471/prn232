using API.DTOs;
using API.Models;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request);
        Task<UserProfileResponseDto> GetUserProfileAsync(int userId);
        Task<UserProfileResponseDto> UpdateUserProfileAsync(int userId, UserProfileUpdateRequestDto request);
        Task<bool> VerifyEmailAsync(string token);
        Task<bool> ResendVerificationEmailAsync(string email);
        Task<bool> SendForgotPasswordPinAsync(string email);
        Task<bool> VerifyForgotPasswordPinAsync(string email, string pin);
        Task<bool> ResetPasswordWithPinAsync(string email, string pin, string newPassword);
        Task<bool> ResendForgotPasswordPinAsync(string email);
    }
} 