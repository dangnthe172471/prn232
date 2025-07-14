using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.News
{
    public class CreateNewsArticleDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Excerpt { get; set; }

        public string? Content { get; set; }

        public int? CategoryId { get; set; }

        public string? ReadTime { get; set; }
        
        public bool IsFeatured { get; set; } = false;

        public string? ImageUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public List<int> TagIds { get; set; } = new List<int>();
    }

    public class UpdateNewsArticleDto
    {
        public string? Title { get; set; }
        public string? Excerpt { get; set; }
        public string? Content { get; set; }
        public int? CategoryId { get; set; }
        public string? ReadTime { get; set; }
        public bool? IsFeatured { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
        public List<int>? TagIds { get; set; }
    }
} 