using Exe201_API.DTOs;
using Exe201_API.Models;
using System.Threading.Tasks;

namespace Exe201_API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<bool> ChangePasswordAsync(ChangePasswordRequestDto request);
        Task<UserProfileResponseDto> GetUserProfileAsync(int userId);
        Task<UserProfileResponseDto> UpdateUserProfileAsync(int userId, UserProfileUpdateRequestDto request);
    }
} 