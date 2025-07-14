using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateJobStatusRequest
    {
        [Required(ErrorMessage = "Trạng thái không được để trống")]
        [RegularExpression("^(confirmed|in_progress|completed|cancelled)$", 
            ErrorMessage = "Trạng thái phải là: confirmed, in_progress, completed, hoặc cancelled")]
        public string Status { get; set; } = string.Empty;
    }
} 