using API.DTOs.News;
using API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public interface INewsService
    {
        Task<PagedResult<NewsArticleDto>> GetNewsArticles(int page, int pageSize, string? categorySlug = null, string? tagSlug = null);
        Task<IEnumerable<NewsArticleDto>> GetFeaturedArticles();
        Task<NewsArticleDetailDto?> GetNewsArticleByIdOrSlug(string idOrSlug);
        Task<IEnumerable<NewsCategoryDto>> GetCategories();
        Task<IEnumerable<NewsTagDto>> GetTags();
        
        // Admin
        Task<NewsArticleDetailDto> CreateArticle(CreateNewsArticleDto dto, int authorId);
        Task<NewsArticleDetailDto> UpdateArticle(int id, UpdateNewsArticleDto dto);
        Task<bool> DeleteArticle(int id);
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
} 