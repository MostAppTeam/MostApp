using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;

[Route("api/[controller]")]
[ApiController]
public class TouristAgenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TouristAgenciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/TouristAgencies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TouristAgency>>> GetTouristAgencies([FromQuery] string name = null, [FromQuery] string sortBy = "name")
    {
        var touristAgencies = _context.TouristAgencies.AsQueryable();

        // Filtriranje po imenu turističke agencije
        if (!string.IsNullOrEmpty(name))
        {
            touristAgencies = touristAgencies.Where(t => t.Name.Contains(name));
        }

        // Sortiranje
        if (sortBy == "name")
        {
            touristAgencies = touristAgencies.OrderBy(t => t.Name);
        }

        return Ok(await touristAgencies.ToListAsync());
    }

    // GET: api/TouristAgencies/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TouristAgency>> GetTouristAgency(int id)
    {
        var touristAgency = await _context.TouristAgencies.FindAsync(id);

        if (touristAgency == null)
        {
            return NotFound();
        }

        return touristAgency;
    }

    // POST: api/TouristAgencies
    [HttpPost]
    public async Task<ActionResult<TouristAgency>> PostTouristAgency(TouristAgency touristAgency)
    {
        _context.TouristAgencies.Add(touristAgency);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTouristAgency), new { id = touristAgency.ID }, touristAgency);
    }

    // PUT: api/TouristAgencies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTouristAgency(int id, TouristAgency touristAgency)
    {
        if (id != touristAgency.ID)
        {
            return BadRequest();
        }

        _context.Entry(touristAgency).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.TouristAgencies.Any(e => e.ID == id))
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

    // DELETE: api/TouristAgencies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTouristAgency(int id)
    {
        var touristAgency = await _context.TouristAgencies.FindAsync(id);
        if (touristAgency == null)
        {
            return NotFound();
        }

        _context.TouristAgencies.Remove(touristAgency);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
