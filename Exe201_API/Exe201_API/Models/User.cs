using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string? Status { get; set; }

    public string? Experience { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Booking> BookingCleaners { get; set; } = new List<Booking>();

    public virtual ICollection<Booking> BookingUsers { get; set; } = new List<Booking>();

    public virtual ICollection<NewsArticle> NewsArticles { get; set; } = new List<NewsArticle>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Review> ReviewCleaners { get; set; } = new List<Review>();

    public virtual ICollection<Review> ReviewUsers { get; set; } = new List<Review>();
}
