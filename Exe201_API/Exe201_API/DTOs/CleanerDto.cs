using System;

namespace Exe201_API.DTOs
{
    public class CleanerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Experience { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public int TotalJobs { get; set; }
        public int CompletedJobs { get; set; }
        public decimal TotalEarnings { get; set; }
    }
} 