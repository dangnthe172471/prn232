using Exe201_API.DTOs;
using Exe201_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Exe201_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> CreateReview([FromBody] CreateReviewRequestDto request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                {
                    return Unauthorized("User not authenticated");
                }

                var review = await _reviewService.CreateReviewAsync(request, userId);
                return Ok(review);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("check/{bookingId}")]
        public async Task<ActionResult<bool>> CheckUserReviewedBooking(int bookingId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                {
                    return Unauthorized("User not authenticated");
                }

                var hasReviewed = await _reviewService.HasUserReviewedBookingAsync(bookingId, userId);
                return Ok(hasReviewed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<ReviewResponseDto>> GetReviewByBookingId(int bookingId)
        {
            try
            {
                var review = await _reviewService.GetReviewByBookingIdAsync(bookingId);
                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPut("{bookingId}")]
        public async Task<ActionResult<ReviewResponseDto>> UpdateReview(int bookingId, [FromBody] CreateReviewRequestDto request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (userId == 0)
                {
                    return Unauthorized("User not authenticated");
                }

                var review = await _reviewService.UpdateReviewAsync(bookingId, userId, request.Rating, request.Comment);
                return Ok(review);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
} 