using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class TimeSlot
{
    public int Id { get; set; }

    public string TimeRange { get; set; } = null!;

    public bool? IsActive { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
