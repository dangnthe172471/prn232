namespace Exe201_API.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public int CompletedBookings { get; set; }
        public decimal TotalSpent { get; set; }
    }
} 