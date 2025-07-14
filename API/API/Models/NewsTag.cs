using System;
using System.Collections.Generic;

namespace API.Models;

public partial class NewsTag
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public virtual ICollection<NewsArticle> Articles { get; set; } = new List<NewsArticle>();
}
