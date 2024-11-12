using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class OffersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OffersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Offer>>> GetOffers()
    {
        return await _context.Offers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Offer>> GetOffer(int id)
    {
        var offer = await _context.Offers.FindAsync(id);

        if (offer == null)
        {
            return NotFound();
        }

        return offer;
    }

    [HttpPost]
    public async Task<ActionResult<Offer>> PostOffer(Offer offer)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOffer), new { id = offer.ID }, offer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutOffer(int id, Offer offer)
    {
        if (id != offer.ID)
        {
            return BadRequest();
        }

        _context.Entry(offer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Offers.Any(e => e.ID == id))
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
    public async Task<IActionResult> DeleteOffer(int id)
    {
        var offer = await _context.Offers.FindAsync(id);
        if (offer == null)
        {
            return NotFound();
        }

        _context.Offers.Remove(offer);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
