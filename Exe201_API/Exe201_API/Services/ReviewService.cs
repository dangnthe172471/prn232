using Exe201_API.DTOs;
using Exe201_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Exe201_API.Services
{
    public class ReviewService : IReviewService
    {
        private readonly CareUContext _context;

        public ReviewService(CareUContext context)
        {
            _context = context;
        }

        public async Task<ReviewResponseDto> CreateReviewAsync(CreateReviewRequestDto request, int userId)
        {
            // Validate booking exists and belongs to user
            var booking = await _context.Bookings
                .Include(b => b.Cleaner)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId && b.UserId == userId);

            if (booking == null)
            {
                throw new ArgumentException("Booking not found or does not belong to user");
            }

            // Check if booking is completed
            if (booking.Status?.ToLower() != "completed")
            {
                throw new ArgumentException("Can only review completed bookings");
            }

            // Check if booking has a cleaner assigned
            if (booking.CleanerId == null || booking.CleanerId == 0)
            {
                throw new ArgumentException("Cannot review booking without assigned cleaner");
            }

            // Check if user already reviewed this booking
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.BookingId == request.BookingId && r.UserId == userId);

            if (existingReview != null)
            {
                throw new ArgumentException("User has already reviewed this booking");
            }

            // Validate rating
            if (request.Rating < 1 || request.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5");
            }

            // Create new review
            var review = new Review
            {
                BookingId = request.BookingId,
                UserId = userId,
                CleanerId = booking.CleanerId.Value,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Return the created review
            return new ReviewResponseDto
            {
                Id = review.Id,
                BookingId = review.BookingId,
                UserId = review.UserId,
                UserName = booking.User.Name,
                CleanerId = review.CleanerId,
                CleanerName = booking.Cleaner?.Name ?? "Unknown",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<bool> HasUserReviewedBookingAsync(int bookingId, int userId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.BookingId == bookingId && r.UserId == userId);
        }

        public async Task<ReviewResponseDto?> GetReviewByBookingIdAsync(int bookingId)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Cleaner)
                .FirstOrDefaultAsync(r => r.BookingId == bookingId);

            if (review == null)
                return null;

            return new ReviewResponseDto
            {
                Id = review.Id,
                BookingId = review.BookingId,
                UserId = review.UserId,
                UserName = review.User.Name,
                CleanerId = review.CleanerId,
                CleanerName = review.Cleaner.Name,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<ReviewResponseDto> UpdateReviewAsync(int bookingId, int userId, int rating, string? comment)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Cleaner)
                .FirstOrDefaultAsync(r => r.BookingId == bookingId && r.UserId == userId);

            if (review == null)
            {
                throw new ArgumentException("Review not found or does not belong to user");
            }

            if (rating < 1 || rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5");
            }

            review.Rating = rating;
            review.Comment = comment;
            await _context.SaveChangesAsync();

            return new ReviewResponseDto
            {
                Id = review.Id,
                BookingId = review.BookingId,
                UserId = review.UserId,
                UserName = review.User.Name,
                CleanerId = review.CleanerId,
                CleanerName = review.Cleaner.Name,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }
    }
} 