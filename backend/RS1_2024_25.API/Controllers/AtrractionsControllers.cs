using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;

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
    public async Task<ActionResult<IEnumerable<Attraction>>> GetAttractions([FromQuery] string name = null, [FromQuery] int? cityId = null, [FromQuery] string sortBy = "name")
    {

      

        var attractions = _context.Attractions.AsQueryable();

        // Filtriranje po imenu
        if (!string.IsNullOrEmpty(name))
        {
            attractions = attractions.Where(a => a.Name.Contains(name));
        }

        // Filtriranje po cityId (nije obavezno)
        if (cityId.HasValue)
        {
            attractions = attractions.Where(a => a.CityID == cityId);
        }

        // Sortiranje
        if (sortBy == "name")
        {
            attractions = attractions.OrderBy(a => a.Name);
        }

        return Ok(await attractions.ToListAsync());
    }

    // GET: api/Attractions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Attraction>> GetAttraction(int id)
    {
        var attraction = await _context.Attractions.FindAsync(id);

        if (attraction == null)
        {
            return NotFound();
        }

        return attraction;
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
