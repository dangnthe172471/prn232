using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int BookingId { get; set; }

    public decimal Amount { get; set; }

    public string? PaymentMethod { get; set; }

    public string? PaymentStatus { get; set; }

    public string? TransactionId { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
