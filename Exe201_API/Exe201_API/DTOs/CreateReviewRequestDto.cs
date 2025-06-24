namespace Exe201_API.DTOs
{
    public class CreateReviewRequestDto
    {
        public int BookingId { get; set; }
        public int Rating { get; set; } // 1-5 stars
        public string? Comment { get; set; }
    }
} 