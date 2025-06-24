using System;
using System.Collections.Generic;

namespace Exe201_API.Models;

public partial class NewsArticle
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public string? Excerpt { get; set; }

    public string? Content { get; set; }

    public int CategoryId { get; set; }

    public int AuthorId { get; set; }

    public DateTime PublishDate { get; set; }

    public string? ReadTime { get; set; }

    public int? Views { get; set; }

    public int? Likes { get; set; }

    public int? Comments { get; set; }

    public bool? IsFeatured { get; set; }

    public string? ImageUrl { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User Author { get; set; } = null!;

    public virtual NewsCategory Category { get; set; } = null!;

    public virtual ICollection<NewsTag> Tags { get; set; } = new List<NewsTag>();
}
