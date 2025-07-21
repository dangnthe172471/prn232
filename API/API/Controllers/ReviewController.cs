using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
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
            if (request == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            if (request.BookingId <= 0)
                return BadRequest(new { message = "BookingId không hợp lệ" });
            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest(new { message = "Rating phải từ 1 đến 5" });
            if (request.Comment != null && request.Comment.Length > 500)
                return BadRequest(new { message = "Comment tối đa 500 ký tự" });
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
            if (bookingId <= 0)
                return BadRequest(new { message = "BookingId không hợp lệ" });
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
            if (bookingId <= 0)
                return BadRequest(new { message = "BookingId không hợp lệ" });
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
            if (bookingId <= 0)
                return BadRequest(new { message = "BookingId không hợp lệ" });
            if (request == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest(new { message = "Rating phải từ 1 đến 5" });
            if (request.Comment != null && request.Comment.Length > 500)
                return BadRequest(new { message = "Comment tối đa 500 ký tự" });
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