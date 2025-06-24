using Exe201_API.DTOs.News;
using Exe201_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Text.RegularExpressions;

namespace Exe201_API.Services
{
    public class NewsService : INewsService
    {
        private readonly CareUContext _context;

        public NewsService(CareUContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<NewsArticleDto>> GetNewsArticles(int page, int pageSize, string? categorySlug = null, string? tagSlug = null)
        {
            IQueryable<NewsArticle> query = _context.NewsArticles
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.IsActive == true && a.PublishDate <= DateTime.UtcNow);

            if (!string.IsNullOrEmpty(categorySlug))
            {
                query = query.Where(a => a.Category.Slug == categorySlug);
            }

            if (!string.IsNullOrEmpty(tagSlug))
            {
                query = query.Where(a => a.Tags.Any(t => t.Slug == tagSlug));
            }
            
            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.PublishDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => ToArticleDto(a))
                .ToListAsync();

            return new PagedResult<NewsArticleDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<NewsArticleDto>> GetFeaturedArticles()
        {
            return await _context.NewsArticles
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.IsActive == true && a.IsFeatured == true && a.PublishDate <= DateTime.UtcNow)
                .OrderByDescending(a => a.PublishDate)
                .Take(5)
                .Select(a => ToArticleDto(a))
                .ToListAsync();
        }
        
        public async Task<NewsArticleDetailDto?> GetNewsArticleByIdOrSlug(string idOrSlug)
        {
            var isNumeric = int.TryParse(idOrSlug, out int id);
            
            var article = await _context.NewsArticles
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.IsActive == true && (isNumeric ? a.Id == id : a.Slug == idOrSlug));
            
            if (article == null) return null;

            var relatedArticles = await _context.NewsArticles
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.IsActive == true && a.CategoryId == article.CategoryId && a.Id != article.Id)
                .OrderByDescending(a => a.PublishDate)
                .Take(3)
                .Select(a => ToArticleDto(a))
                .ToListAsync();

            return ToArticleDetailDto(article, relatedArticles);
        }

        public async Task<IEnumerable<NewsCategoryDto>> GetCategories()
        {
            return await _context.NewsCategories
                .AsNoTracking()
                .Where(c => c.IsActive == true)
                .Select(c => new NewsCategoryDto { Id = c.Id, Name = c.Name, Slug = c.Slug })
                .ToListAsync();
        }

        public async Task<IEnumerable<NewsTagDto>> GetTags()
        {
            return await _context.NewsTags
                .AsNoTracking()
                .Select(t => new NewsTagDto { Id = t.Id, Name = t.Name, Slug = t.Slug })
                .ToListAsync();
        }
        
        public async Task<NewsArticleDetailDto> CreateArticle(CreateNewsArticleDto dto, int authorId)
        {
            var slug = GenerateSlug(dto.Title);

            var newArticle = new NewsArticle
            {
                Title = dto.Title,
                Slug = slug,
                Excerpt = dto.Excerpt,
                Content = dto.Content,
                CategoryId = dto.CategoryId ?? 1, // Default to category ID 1 if none provided
                AuthorId = authorId,
                ReadTime = dto.ReadTime,
                IsFeatured = dto.IsFeatured,
                ImageUrl = dto.ImageUrl,
                IsActive = dto.IsActive,
                PublishDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.TagIds != null && dto.TagIds.Any())
            {
                var tags = await _context.NewsTags.Where(t => dto.TagIds.Contains(t.Id)).ToListAsync();
                newArticle.Tags = tags;
            }
            
            _context.NewsArticles.Add(newArticle);
            await _context.SaveChangesAsync();
            
            return (await GetNewsArticleByIdOrSlug(newArticle.Id.ToString()))!;
        }

        public async Task<NewsArticleDetailDto> UpdateArticle(int id, UpdateNewsArticleDto dto)
        {
            var article = await _context.NewsArticles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Include(a => a.Tags)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (article == null) throw new ArgumentException("Không tìm thấy bài viết");

            // Chỉ cập nhật những field được cung cấp
            if (!string.IsNullOrEmpty(dto.Title))
            {
                article.Title = dto.Title;
                article.Slug = GenerateSlug(dto.Title);
            }
            if (dto.Excerpt != null) article.Excerpt = dto.Excerpt;
            if (dto.Content != null) article.Content = dto.Content;
            if (dto.CategoryId.HasValue) article.CategoryId = dto.CategoryId.Value;
            if (dto.ReadTime != null) article.ReadTime = dto.ReadTime;
            if (dto.IsFeatured.HasValue) article.IsFeatured = dto.IsFeatured.Value;
            if (dto.ImageUrl != null) article.ImageUrl = dto.ImageUrl;
            if (dto.IsActive.HasValue) article.IsActive = dto.IsActive.Value;
            
            article.UpdatedAt = DateTime.UtcNow;

            // Cập nhật tags nếu được cung cấp
            if (dto.TagIds != null)
            {
                article.Tags.Clear();
                if (dto.TagIds.Any())
                {
                    var tags = await _context.NewsTags.Where(t => dto.TagIds.Contains(t.Id)).ToListAsync();
                    foreach (var tag in tags)
                    {
                        article.Tags.Add(tag);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return (await GetNewsArticleByIdOrSlug(id.ToString()))!;
        }

        public async Task<bool> DeleteArticle(int id)
        {
            var article = await _context.NewsArticles.FindAsync(id);
            if (article == null) return false;

            // Soft delete
            article.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper methods
        private static NewsArticleDto ToArticleDto(NewsArticle a) => new NewsArticleDto
        {
            Id = a.Id,
            Title = a.Title,
            Slug = a.Slug,
            Excerpt = a.Excerpt,
            ImageUrl = a.ImageUrl,
            PublishDate = a.PublishDate,
            ReadTime = a.ReadTime,
            Category = a.Category != null ? new NewsCategoryDto { Id = a.Category.Id, Name = a.Category.Name, Slug = a.Category.Slug } : null,
            Author = a.Author != null ? new AuthorDto { Id = a.Author.Id, Name = a.Author.Name, Email = a.Author.Email, Avatar = null } : null
        };

        private static NewsArticleDetailDto ToArticleDetailDto(NewsArticle a, List<NewsArticleDto> related) => new NewsArticleDetailDto
        {
            Id = a.Id,
            Title = a.Title,
            Slug = a.Slug,
            Excerpt = a.Excerpt,
            ImageUrl = a.ImageUrl,
            PublishDate = a.PublishDate,
            ReadTime = a.ReadTime,
            Content = a.Content,
            Category = a.Category != null ? new NewsCategoryDto { Id = a.Category.Id, Name = a.Category.Name, Slug = a.Category.Slug } : null,
            Author = a.Author != null ? new AuthorDto { Id = a.Author.Id, Name = a.Author.Name, Email = a.Author.Email, Avatar = null } : null,
            Tags = a.Tags.Select(t => new NewsTagDto { Id = t.Id, Name = t.Name, Slug = t.Slug }).ToList(),
            RelatedArticles = related
        };
        
        private static string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); // remove invalid chars
            str = Regex.Replace(str, @"\s+", " ").Trim(); // convert multiple spaces into one space
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim(); // cut and trim
            str = Regex.Replace(str, @"\s", "-"); // replace spaces with hyphens
            return str;
        }
    }
} 