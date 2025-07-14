using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateBookingRequestDto
    {
        [Required]
        public int ServiceId { get; set; }
        [Required]
        public int AreaSizeId { get; set; }
        [Required]
        public int TimeSlotId { get; set; }
        [Required]
        public DateOnly BookingDate { get; set; }

        [Required(ErrorMessage = "Quận/Huyện - Tỉnh/Thành phố không được để trống")]
        [StringLength(150)]
        public string AddressDistrict { get; set; }

        [Required(ErrorMessage = "Địa chỉ chi tiết không được để trống")]
        [StringLength(200)]
        public string AddressDetail { get; set; }

        [Required]
        [StringLength(100)]
        public string ContactName { get; set; }
        [Required]
        [Phone]
        public string ContactPhone { get; set; }
        [StringLength(500)]
        public string? Notes { get; set; }
    }
} 