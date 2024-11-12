using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
    public async Task<ActionResult<IEnumerable<Attraction>>> GetAttractions()
    {
        return await _context.Attractions.ToListAsync();
    }

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

    [HttpPost]
    public async Task<ActionResult<Attraction>> PostAttraction(Attraction attraction)
    {
        _context.Attractions.Add(attraction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAttraction), new { id = attraction.ID }, attraction);
    }

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
