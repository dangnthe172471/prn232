using System;
using System.Collections.Generic;

namespace API.DTOs.News
{
    public class NewsArticleDetailDto : NewsArticleDto
    {
        public string? Content { get; set; }
        public ICollection<NewsTagDto> Tags { get; set; } = new List<NewsTagDto>();
        public ICollection<NewsArticleDto> RelatedArticles { get; set; } = new List<NewsArticleDto>();
    }
} 