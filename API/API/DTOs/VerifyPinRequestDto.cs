using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class VerifyPinRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string Pin { get; set; }
    }
} 