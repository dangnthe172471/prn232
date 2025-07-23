using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReferenceDataController : ControllerBase
    {
        private readonly CareUContext _context;

        public ReferenceDataController(CareUContext context)
        {
            _context = context;
        }

        [HttpGet("services")]
        public async Task<IActionResult> GetServices()
        {
            var services = await _context.Services
                .Where(s => s.IsActive == true)
                .Select(s => new { s.Id, s.Name, s.BasePrice, s.Icon })
                .ToListAsync();
            return Ok(services);
        }

        // --- Service Management (CRUD) ---
        [HttpGet("services/all")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _context.Services.ToListAsync();
            return Ok(services);
        }

        [HttpPost("services")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateService([FromBody] CreateServiceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var service = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                Duration = dto.Duration,
                Icon = dto.Icon,
                IsActive = dto.IsActive
            };
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return Created("", service);
        }

        [HttpPut("services/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] UpdateServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();
            service.Name = dto.Name;
            service.Description = dto.Description;
            service.BasePrice = dto.BasePrice;
            service.Duration = dto.Duration;
            service.Icon = dto.Icon;
            service.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok(service);
        }

        [HttpDelete("services/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("areasizes")]
        public async Task<IActionResult> GetAreaSizes()
        {
            var areaSizes = await _context.AreaSizes
                .Where(a => a.IsActive == true)
                .Select(a => new { a.Id, a.Name, a.Multiplier })
                .ToListAsync();
            return Ok(areaSizes);
        }

        [HttpGet("timeslots")]
        public async Task<IActionResult> GetTimeSlots()
        {
            var timeSlots = await _context.TimeSlots
                .Where(t => t.IsActive == true)
                .Select(t => new { t.Id, t.TimeRange })
                .ToListAsync();
            return Ok(timeSlots);
        }
    }
} 