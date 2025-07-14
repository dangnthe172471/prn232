using API.DTOs;

namespace API.Services
{
    public interface IReviewService
    {
        Task<ReviewResponseDto> CreateReviewAsync(CreateReviewRequestDto request, int userId);
        Task<bool> HasUserReviewedBookingAsync(int bookingId, int userId);
        Task<ReviewResponseDto?> GetReviewByBookingIdAsync(int bookingId);
        Task<ReviewResponseDto> UpdateReviewAsync(int bookingId, int userId, int rating, string? comment);
    }
} 