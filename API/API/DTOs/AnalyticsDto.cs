namespace API.DTOs
{
    public class TopCustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int TotalBookings { get; set; }
        public decimal TotalSpent { get; set; }
        public DateTime LastBookingDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TopCleanerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public decimal TotalEarnings { get; set; }
        public double AverageRating { get; set; }
        public DateTime LastBookingDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 