using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

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
    public async Task<ActionResult<IEnumerable<Museum>>> GetMuseums()
    {
        return await _context.Museums.ToListAsync();
    }

    // GET: api/Museums/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Museum>> GetMuseum(int id)
    {
        var museum = await _context.Museums.FindAsync(id);

        if (museum == null)
        {
            return NotFound();
        }

        return museum;
    }

    // POST: api/Museums
    [HttpPost]
    public async Task<ActionResult<Museum>> PostMuseum(Museum museum)
    {
        _context.Museums.Add(museum);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMuseum), new { id = museum.ID }, museum);
    }

    // PUT: api/Museums/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMuseum(int id, Museum museum)
    {
        if (id != museum.ID)
        {
            return BadRequest();
        }

        _context.Entry(museum).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MuseumExists(id))
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

    private bool MuseumExists(int id)
    {
        return _context.Museums.Any(e => e.ID == id);
    }
}
