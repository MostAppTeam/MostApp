using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ShoppingCentersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ShoppingCentersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingCenter>>> GetShoppingCenters()
    {
        return await _context.ShoppingCenters.ToListAsync();
    }

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

    [HttpPost]
    public async Task<ActionResult<ShoppingCenter>> PostShoppingCenter(ShoppingCenter shoppingCenter)
    {
        _context.ShoppingCenters.Add(shoppingCenter);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShoppingCenter), new { id = shoppingCenter.ID }, shoppingCenter);
    }

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
            if (!_context.ShoppingCenters.Any(e => e.ID == id))
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
}
