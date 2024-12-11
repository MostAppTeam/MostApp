using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AttractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AttractionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Attractions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAttractions(
     [FromQuery] string name = null,
     [FromQuery] string sortBy = "name",
     [FromQuery] string sortDirection = "asc")
    {
        var attractions = _context.Attractions.AsQueryable();

        // Filtriranje po imenu
        if (!string.IsNullOrEmpty(name))
        {
            attractions = attractions.Where(a => a.Name.Contains(name));
        }

        // Dinamično sortiranje po podržanim poljima
        attractions = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Name)
                        : attractions.OrderBy(a => a.Name),
            "description" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Description)
                        : attractions.OrderBy(a => a.Description),
            "virtualtoururl" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.VirtualTourURL)
                        : attractions.OrderBy(a => a.VirtualTourURL),
            _ => attractions.OrderBy(a => a.Name) // Defaultno sortiranje po imenu
        };

        // Projekcija podataka u rezultat
        var result = await attractions
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.VirtualTourURL // Vraćanje ovog polja u odgovoru
            })
            .ToListAsync();

        return Ok(result);
    }

    // GET: api/Attractions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetAttraction(int id)
    {
        var attraction = await _context.Attractions
            .Where(a => a.ID == id)
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.CityID,
                a.VirtualTourURL
            })
            .FirstOrDefaultAsync();

        if (attraction == null)
        {
            return NotFound();
        }

        return Ok(attraction);
    }

    // POST: api/Attractions
    [HttpPost]
    public async Task<ActionResult<Attraction>> PostAttraction(Attraction attraction)
    {
        _context.Attractions.Add(attraction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAttraction), new { id = attraction.ID }, attraction);
    }

    // PUT: api/Attractions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAttraction(int id, Attraction attraction)
    {
        if (id != attraction.ID)
        {
            return BadRequest();
        }

        _context.Entry(attraction).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Attractions.Any(e => e.ID == id))
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

    // DELETE: api/Attractions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttraction(int id)
    {
        var attraction = await _context.Attractions.FindAsync(id);
        if (attraction == null)
        {
            return NotFound();
        }

        _context.Attractions.Remove(attraction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
