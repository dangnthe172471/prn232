using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class Booking
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ServiceId { get; set; }

    public int AreaSizeId { get; set; }

    public int? TimeSlotId { get; set; }

    public int? CleanerId { get; set; }

    public DateOnly BookingDate { get; set; }

    public string Address { get; set; } = null!;

    public string ContactName { get; set; } = null!;

    public string ContactPhone { get; set; } = null!;

    public string? Notes { get; set; }

    public decimal TotalPrice { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual AreaSize AreaSize { get; set; } = null!;

    public virtual User? Cleaner { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Service Service { get; set; } = null!;

    public virtual TimeSlot? TimeSlot { get; set; }

    public virtual User User { get; set; } = null!;
}
