using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;

[Route("api/[controller]")]
[ApiController]
public class ShoppingCentersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ShoppingCentersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/ShoppingCenters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingCenter>>> GetShoppingCenters([FromQuery] string name = null, [FromQuery] string sortBy = "name")
    {
        var shoppingCenters = _context.ShoppingCenters.AsQueryable();

        // Filtriranje po imenu shopping centra (nije obavezno)
        if (!string.IsNullOrEmpty(name))
        {
            shoppingCenters = shoppingCenters.Where(s => s.Name.Contains(name));
        }

        // Sortiranje (nije obavezno)
        if (sortBy == "name")
        {
            shoppingCenters = shoppingCenters.OrderBy(s => s.Name);
        }
        // Dodajte više sortiranja ako želite, kao npr. po cityId ili sličnom

        return Ok(await shoppingCenters.ToListAsync());
    }

    // GET: api/ShoppingCenters/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ShoppingCenter>> GetShoppingCenter(int id)
    {
        var shoppingCenter = await _context.ShoppingCenters.FindAsync(id);

        if (shoppingCenter == null)
        {
            return NotFound();
        }

        return shoppingCenter;
    }

    // POST: api/ShoppingCenters
    [HttpPost]
    public async Task<ActionResult<ShoppingCenter>> PostShoppingCenter(ShoppingCenter shoppingCenter)
    {
        _context.ShoppingCenters.Add(shoppingCenter);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShoppingCenter), new { id = shoppingCenter.ID }, shoppingCenter);
    }

    // PUT: api/ShoppingCenters/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutShoppingCenter(int id, ShoppingCenter shoppingCenter)
    {
        if (id != shoppingCenter.ID)
        {
            return BadRequest();
        }

        _context.Entry(shoppingCenter).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ShoppingCenterExists(id))
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

    // DELETE: api/ShoppingCenters/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShoppingCenter(int id)
    {
        var shoppingCenter = await _context.ShoppingCenters.FindAsync(id);
        if (shoppingCenter == null)
        {
            return NotFound();
        }

        _context.ShoppingCenters.Remove(shoppingCenter);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ShoppingCenterExists(int id)
    {
        return _context.ShoppingCenters.Any(e => e.ID == id);
    }
}
