using API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class TestDBController : Controller
    {
        private readonly CareUContext _context;
        public TestDBController(CareUContext context)
        {
            _context = context;
        }
        [HttpGet("getUser")]
        public IActionResult getUser()
        {
            var result = _context.Users.ToList();
            return Ok(result);
        }

        [HttpPost("seed-news-data")]
        public async Task<IActionResult> SeedNewsData()
        {
            try
            {
                // Tạo categories
                if (!_context.NewsCategories.Any())
                {
                    var categories = new List<NewsCategory>
                    {
                        new NewsCategory { Name = "Tin tức chung", Slug = "tin-tuc-chung", IsActive = true },
                        new NewsCategory { Name = "Dịch vụ", Slug = "dich-vu", IsActive = true },
                        new NewsCategory { Name = "Khuyến mãi", Slug = "khuyen-mai", IsActive = true },
                        new NewsCategory { Name = "Hướng dẫn", Slug = "huong-dan", IsActive = true }
                    };
                    _context.NewsCategories.AddRange(categories);
                }

                // Tạo tags
                if (!_context.NewsTags.Any())
                {
                    var tags = new List<NewsTag>
                    {
                        new NewsTag { Name = "Dọn dẹp", Slug = "don-dep" },
                        new NewsTag { Name = "Vệ sinh", Slug = "ve-sinh" },
                        new NewsTag { Name = "Khuyến mãi", Slug = "khuyen-mai" },
                        new NewsTag { Name = "Hướng dẫn", Slug = "huong-dan" },
                        new NewsTag { Name = "Tin tức", Slug = "tin-tuc" }
                    };
                    _context.NewsTags.AddRange(tags);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã tạo dữ liệu mẫu cho News thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo dữ liệu mẫu", error = ex.Message });
            }
        }
    }
}
