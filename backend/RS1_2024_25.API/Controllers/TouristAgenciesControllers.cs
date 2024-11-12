using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TouristAgenciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TouristAgenciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TouristAgency>>> GetTouristAgencies()
    {
        return await _context.TouristAgencies.ToListAsync();
    }

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

    [HttpPost]
    public async Task<ActionResult<TouristAgency>> PostTouristAgency(TouristAgency touristAgency)
    {
        _context.TouristAgencies.Add(touristAgency);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTouristAgency), new { id = touristAgency.ID }, touristAgency);
    }

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
