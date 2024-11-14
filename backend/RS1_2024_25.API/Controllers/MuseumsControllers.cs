using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;

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
    public async Task<ActionResult<IEnumerable<Museum>>> GetMuseums(
        [FromQuery] string name = null, [FromQuery] int? cityId = null, [FromQuery] string sortBy = "name")
    {
        var museums = _context.Museums.AsQueryable();

        // Filtriranje po imenu muzeja (nije obavezno)
        if (!string.IsNullOrEmpty(name))
        {
            museums = museums.Where(m => m.Name.Contains(name));
        }

     

        // Sortiranje muzeja
        if (sortBy == "name")
        {
            museums = museums.OrderBy(m => m.Name);
        }

        return Ok(museums.ToList());

    }

    // Ostale metode (POST, PUT, DELETE) ostaju iste kao što su bile
}
