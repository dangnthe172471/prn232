using Microsoft.AspNetCore.Mvc;
using CleanView.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CleanView.Controllers
{
    public class AuthController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public AuthController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://localhost:5001/api/auth/login", content);
            if (response.IsSuccessStatusCode)
            {
                // Xử lý lưu token nếu cần
                return RedirectToAction("Index", "Home");
            }
            ModelState.AddModelError("", "Đăng nhập thất bại");
            return View(model);
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            var client = _httpClientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://localhost:5001/api/auth/register", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("Login");
            }
            ModelState.AddModelError("", "Đăng ký thất bại");
            return View(model);
        }
    }
} 