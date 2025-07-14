using System;
using System.Collections.Generic;

namespace API.DTOs.News
{
    public class NewsArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime PublishDate { get; set; }
        public string? ReadTime { get; set; }
        public NewsCategoryDto? Category { get; set; }
        public AuthorDto? Author { get; set; }
    }
} 