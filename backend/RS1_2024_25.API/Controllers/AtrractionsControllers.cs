using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Auth;

[Route("api/[controller]")]
[ApiController]
public class AttractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AttractionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAttractions(
       [FromQuery] string name = null,
       [FromQuery] string category = null,
       [FromQuery] string sortBy = "name",
       [FromQuery] string sortDirection = "asc")
    {
        var attractions = _context.Attractions.AsQueryable();

        // Filtriranje po imenu
        if (!string.IsNullOrEmpty(name))
            attractions = attractions.Where(a => a.Name.Contains(name));

        // Filtriranje po kategoriji
        if (!string.IsNullOrEmpty(category) && category != "All")
            attractions = attractions.Where(a => a.Category == category);

        // Sortiranje
        attractions = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Name)
                        : attractions.OrderBy(a => a.Name),
            "description" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Description)
                        : attractions.OrderBy(a => a.Description),
            _ => attractions.OrderBy(a => a.Name)
        };

        var result = await attractions
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.VirtualTourURL,
                a.Category
            })
            .ToListAsync();

        return Ok(result);
    }



    // GET: api/Attractions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetAttraction(int id)
    {
        var attraction = await _context.Attractions
            .Include(a => a.Options) // Include opcije
            .Where(a => a.ID == id)
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.CityID,
                a.VirtualTourURL,
                a.IsPaid,
                Options = a.Options.Select(o => new { o.OptionType, o.OptionValue }).ToList()
            })
            .FirstOrDefaultAsync();

        if (attraction == null)
            return NotFound();

        return Ok(attraction);
    }


    [HttpPost]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<ActionResult<Attraction>> PostAttraction(Attraction attraction)
    {
        _context.Attractions.Add(attraction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAttraction), new { id = attraction.ID }, attraction);
    }

    // PUT: api/Attractions/5
    [HttpPut("{id}")]
    [MyAuthorization(isAdmin: true, isManager: true)]
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
    [MyAuthorization(isAdmin: true, isManager: true)]
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
