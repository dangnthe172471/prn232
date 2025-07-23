namespace API.DTOs
{
    public class UpdateServiceDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public string? Duration { get; set; }
        public string? Icon { get; set; }
        public bool IsActive { get; set; }
    }
} 