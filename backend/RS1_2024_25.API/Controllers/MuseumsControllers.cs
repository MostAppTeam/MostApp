using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class MuseumsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MuseumsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Museums
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Museum>>> GetMuseums(
        [FromQuery] string name = null,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDirection = "asc")
    {
        var museums = _context.Museums.AsQueryable();

        // Filtriranje po imenu muzeja (nije obavezno)
        if (!string.IsNullOrEmpty(name))
        {
            museums = museums.Where(m => m.Name.Contains(name));
        }

        // Dinamično sortiranje
        museums = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Name)
                        : museums.OrderBy(m => m.Name),
            "location" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Location)
                        : museums.OrderBy(m => m.Location),
            "description" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Description)
                        : museums.OrderBy(m => m.Description),
            _ => museums.OrderBy(m => m.Name) // Defaultno sortiranje
        };

        return Ok(await museums.ToListAsync());
    }

    // GET: api/Museums/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Museum>> GetMuseumById(int id)
    {
        var museum = await _context.Museums.FindAsync(id);

        if (museum == null)
        {
            return NotFound();
        }

        return Ok(museum);
    }

    // POST: api/Museums
    [HttpPost]
    public async Task<ActionResult<Museum>> CreateMuseum(Museum museum)
    {
        _context.Museums.Add(museum);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMuseumById), new { id = museum.ID }, museum);
    }

    // PUT: api/Museums/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMuseum(int id, Museum museum)
    {
        if (id != museum.ID)
        {
            return BadRequest("Museum ID mismatch.");
        }

        _context.Entry(museum).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Museums.Any(m => m.ID == id))
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

    // DELETE: api/Museums/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMuseum(int id)
    {
        var museum = await _context.Museums.FindAsync(id);

        if (museum == null)
        {
            return NotFound();
        }

        _context.Museums.Remove(museum);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}