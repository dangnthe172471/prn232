using System.ComponentModel.DataAnnotations;

namespace CleanView.Models
{
    public class RegisterViewModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string Role { get; set; } = "user";
        public string Experience { get; set; } // chỉ dùng cho cleaner
        [Required]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Bạn phải đồng ý với điều khoản sử dụng")]
        public bool AgreeTerms { get; set; }
    }
} 