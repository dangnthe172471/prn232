using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu cũ không được để trống")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu cũ phải từ 6 ký tự trở lên")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Mật khẩu mới không được để trống")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu mới phải từ 6 ký tự trở lên")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Xác nhận mật khẩu mới không được để trống")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Xác nhận mật khẩu mới phải từ 6 ký tự trở lên")]
        public string ReNewPassword { get; set; }
    }
} 