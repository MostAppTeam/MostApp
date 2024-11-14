using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;

[Route("api/[controller]")]
[ApiController]
public class OffersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OffersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Offers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Offer>>> GetOffers([FromQuery] string name = null, [FromQuery] string sortBy = "name")
    {
        var offers = _context.Offers.AsQueryable();

        // Filtriranje po opisu ponude (nije obavezno)
        if (!string.IsNullOrEmpty(name))
        {
            offers = offers.Where(o => o.Description.Contains(name));
        }

        // Sortiranje
        if (sortBy == "name")
        {
            offers = offers.OrderBy(o => o.Description);
        }

        return Ok(await offers.ToListAsync());
    }

    // GET: api/Offers/5
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

    // POST: api/Offers
    [HttpPost]
    public async Task<ActionResult<Offer>> PostOffer(Offer offer)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOffer), new { id = offer.ID }, offer);
    }

    // PUT: api/Offers/5
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

    // DELETE: api/Offers/5
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
