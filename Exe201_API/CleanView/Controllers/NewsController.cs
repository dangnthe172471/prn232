using Microsoft.AspNetCore.Mvc;
using CleanView.Models;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace CleanView.Controllers
{
    public class NewsController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public NewsController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IActionResult> Index()
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync("https://localhost:5001/api/news"); // Sửa lại URL nếu cần
            var newsList = new List<NewsViewModel>();
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                newsList = JsonSerializer.Deserialize<List<NewsViewModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            return View(newsList);
        }
    }
} 