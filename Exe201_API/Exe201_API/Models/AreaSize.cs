using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class AreaSize
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Multiplier { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
