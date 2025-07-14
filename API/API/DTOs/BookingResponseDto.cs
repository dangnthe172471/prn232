namespace API.DTOs
{
    public class BookingResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string ServiceName { get; set; }
        public string AreaSizeName { get; set; }
        public string TimeSlotRange { get; set; }
        public DateOnly BookingDate { get; set; }
        public string Address { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string? Notes { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public string? CleanerName { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
} 