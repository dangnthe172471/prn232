using System;

namespace API.DTOs
{
    public class BillDto
    {
        public int Id { get; set; }
        public string BillId { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
} 