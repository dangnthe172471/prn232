using System;

namespace Exe201_API.DTOs
{
    public class BookingDetailDto
    {
        public int Id { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string AreaSize { get; set; } = string.Empty;
        public string TimeSlot { get; set; } = string.Empty;
        public DateOnly BookingDate { get; set; }
        public string Address { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? CleanerId { get; set; }
        public string? CleanerName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 