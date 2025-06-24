namespace Exe201_API.DTOs
{
    public class CleanerDashboardStatsDto
    {
        public int AvailableJobs { get; set; }
        public int MyJobs { get; set; }
        public int CompletedJobs { get; set; }
        public decimal TotalEarnings { get; set; }
        public int PendingJobs { get; set; }
        public int InProgressJobs { get; set; }
    }
} 