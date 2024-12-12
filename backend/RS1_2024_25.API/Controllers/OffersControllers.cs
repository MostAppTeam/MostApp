using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;

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

        // Filteriranje po opisu ponude (nije obavezno)
        if (!string.IsNullOrEmpty(name))
        {
            offers = offers.Where(o => o.Description.Contains(name));
        }

        // Sortiranje
        offers = sortBy.ToLower() switch
        {
            "name" => offers.OrderBy(o => o.Description),
            _ => offers // Dodaj druge kriterije sortiranja po potrebi
        };

        return Ok(await offers.ToListAsync());
    }

    // GET: api/Offers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Offer>> GetOffer(int id)
    {
        var offer = await _context.Offers.FindAsync(id);

        if (offer == null)
        {
            return NotFound(new { message = "Offer not found." });
        }

        return Ok(offer);
    }

    // POST: api/Offers
    [HttpPost]
    public async Task<ActionResult<Offer>> PostOffer(Offer offer)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOffer), new { id = offer.ID }, offer);
    }

    // PUT: api/Offers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOffer(int id, Offer offer)
    {
        if (id != offer.ID)
        {
            return BadRequest(new { message = "ID mismatch." });
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
                return NotFound(new { message = "Offer not found." });
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Offers/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOffer(int id)
    {
        var offer = await _context.Offers.FindAsync(id);
        if (offer == null)
        {
            return NotFound(new { message = "Offer not found." });
        }

        _context.Offers.Remove(offer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Offers/create-paypal-order
    [HttpPost("create-paypal-order")]
    public async Task<IActionResult> CreatePayPalOrder([FromBody] PaymentRequest request, [FromServices] PayPalPaymentService paymentService)
    {
        try
        {
            var approvalLink = await paymentService.CreateOrderAsync(request.OfferName, request.Amount);
            return Ok(new { approvalUrl = approvalLink });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/Offers/capture-paypal-order
    [HttpPost("capture-paypal-order")]
    public async Task<IActionResult> CapturePayPalOrder([FromBody] CapturePaymentRequest request, [FromServices] PayPalPaymentService paymentService)
    {
        try
        {
            var result = await paymentService.CaptureOrderAsync(request.OrderId);
            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DTOs for Payment Requests
    public class PaymentRequest
    {
        public string OfferName { get; set; }
        public decimal Amount { get; set; }
    }

    public class CapturePaymentRequest
    {
        public string OrderId { get; set; } // "token" koji PayPal vraća
    }
}
