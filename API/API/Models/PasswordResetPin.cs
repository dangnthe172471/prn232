using System;
using System.Collections.Generic;

namespace API.Models;

public partial class PasswordResetPin
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string Pin { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public bool? IsUsed { get; set; }
}
