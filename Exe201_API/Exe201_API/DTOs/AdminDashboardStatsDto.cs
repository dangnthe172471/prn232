using System.Collections.Generic;

namespace Exe201_API.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalCustomers { get; set; }
        public int TotalCleaners { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalBills { get; set; }
        
        // Booking statistics by status
        public Dictionary<string, int> BookingsByStatus { get; set; } = new Dictionary<string, int>();
        
        // Revenue by service type
        public Dictionary<string, decimal> RevenueByService { get; set; } = new Dictionary<string, decimal>();
        
        // Cleaner statistics
        public int PendingCleaners { get; set; }
        public int ActiveCleaners { get; set; }
        
        // Recent activity
        public int RecentBookings { get; set; } // Last 7 days
        public decimal RecentRevenue { get; set; } // Last 7 days
    }
} 