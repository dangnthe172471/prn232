using Exe201_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Exe201_API.Controllers
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