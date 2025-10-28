using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Auth;

namespace RS1_2024_25.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EventControllers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents([FromQuery] string name = null, [FromQuery] string date = null, [FromQuery] string location = null, [FromQuery] string description = null, [FromQuery] int? id = null, [FromQuery] string sortBy = "date")
        {
            var events = _context.Events.AsQueryable();

            // Filtriranje
            if (!string.IsNullOrEmpty(name))
            {
                events = events.Where(e => e.Name.Contains(name));
            }
            if (!string.IsNullOrEmpty(date))
            {
                events = events.Where(e => e.Date == date);
            }
            if (!string.IsNullOrEmpty(location))
            {
                events = events.Where(e => e.Location.Contains(location));
            }
            if (!string.IsNullOrEmpty(description))
            {
                events = events.Where(e => e.Description.Contains(description));
            }
            if (id.HasValue)
            {
                events = events.Where(e => e.ID == id.Value);
            }

            // Sortiranje
            if (sortBy == "date")
            {
                events = events.OrderBy(e => e.Date);
            }
            else if (sortBy == "name")
            {
                events = events.OrderBy(e => e.Name);
            }

            return Ok(await events.ToListAsync());
        }
        // POST: api/Event/upload-image
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Kreiraj folder ako ne postoji
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "events");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            // Jedinstveno ime fajla
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            // Snimi fajl
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Vrati relativni put koji možeš upisati u bazu / prikazati na frontendu
            var relativePath = $"/images/events/{fileName}";
            return Ok(new { imageUrl = relativePath });
        }

        // GET: api/EventControllers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        // POST: api/EventControllers
        [HttpPost]
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<ActionResult<Event>> PostEvent(Event @event)
        {

            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = @event.ID }, @event);
            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = @event.ID }, @event);
        }

        // PUT: api/EventControllers/5
        [HttpPut("{id}")]
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<IActionResult> PutEvent(int id, Event @event)
        {
            if (id != @event.ID)
            {
                return BadRequest();
            }

           

            _context.Entry(@event).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Events.Any(e => e.ID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/EventControllers/5
        [HttpDelete("{id}")]
     
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
