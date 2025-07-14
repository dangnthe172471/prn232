namespace API.DTOs
{
    public class UserProfileResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? Status { get; set; }
        public string? Experience { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
} 