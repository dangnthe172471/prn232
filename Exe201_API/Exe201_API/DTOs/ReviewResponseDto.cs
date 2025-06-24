namespace Exe201_API.DTOs
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int CleanerId { get; set; }
        public string CleanerName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
} 