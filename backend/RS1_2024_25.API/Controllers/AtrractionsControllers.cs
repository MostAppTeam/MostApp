using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Auth;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AttractionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    // dozvoljene ekstenzije i mime tipovi (po želji proširi)
    private static readonly string[] AllowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
    private static readonly string[] AllowedContentTypes = new[] { "image/jpeg", "image/png", "image/webp" };

    public AttractionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Attractions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAttractions(
      [FromQuery] string name = null,
      [FromQuery] string sortBy = "name",
      [FromQuery] string sortDirection = "asc")
    {
        var attractions = _context.Attractions.AsQueryable();

        if (!string.IsNullOrEmpty(name))
            attractions = attractions.Where(a => a.Name.Contains(name));

        attractions = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Name)
                        : attractions.OrderBy(a => a.Name),
            "description" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.Description)
                        : attractions.OrderBy(a => a.Description),
            "virtualtoururl" => sortDirection.ToLower() == "desc"
                        ? attractions.OrderByDescending(a => a.VirtualTourURL)
                        : attractions.OrderBy(a => a.VirtualTourURL),
            _ => attractions.OrderBy(a => a.Name)
        };

        var result = await attractions
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.VirtualTourURL,
                a.ImageUrl   // ✅ vrati sliku u listi
            })
            .ToListAsync();

        return Ok(result);
    }

    // GET: api/Attractions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetAttraction(int id)
    {
        var attraction = await _context.Attractions
            .Where(a => a.ID == id)
            .Select(a => new
            {
                a.ID,
                a.Name,
                a.Description,
                a.CityID,
                a.VirtualTourURL,
                a.ImageUrl   // ✅ vrati sliku u detaljima
            })
            .FirstOrDefaultAsync();

        if (attraction == null)
            return NotFound();

        return Ok(attraction);
    }

    // POST: api/Attractions
    [HttpPost]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<ActionResult<Attraction>> PostAttraction([FromBody] Attraction attraction)
    {
        // ✅ spriječi IDENTITY_INSERT grešku
        attraction.ID = 0;

        // ✅ ako stigne ugniježden City, mapiraj na FK i null-iraj navigaciju
        if (attraction.City != null)
        {
            attraction.CityID = attraction.City.ID;
            attraction.City = null;
        }

        _context.Attractions.Add(attraction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAttraction), new { id = attraction.ID }, attraction);
    }

    // PUT: api/Attractions/5
    [HttpPut("{id}")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<IActionResult> PutAttraction(int id, [FromBody] Attraction attraction)
    {
        if (id != attraction.ID)
            return BadRequest();

        // ✅ ne dirati identity ID
        _context.Entry(attraction).Property(a => a.ID).IsModified = false;

        // ✅ ako stigne ugniježden City, mapiraj na FK i null-iraj navigaciju
        if (attraction.City != null)
        {
            attraction.CityID = attraction.City.ID;
            attraction.City = null;
        }

        _context.Entry(attraction).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Attractions.Any(e => e.ID == id))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    // DELETE: api/Attractions/5
    [HttpDelete("{id}")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<IActionResult> DeleteAttraction(int id)
    {
        var attraction = await _context.Attractions.FindAsync(id);
        if (attraction == null)
            return NotFound();

        _context.Attractions.Remove(attraction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/Attractions/upload-image
    [HttpPost("upload-image")]
    [RequestSizeLimit(10_000_000)] // ~10 MB, po potrebi promijeni
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Provjeri tip i ekstenziju
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext) || !AllowedContentTypes.Contains(file.ContentType))
            return BadRequest("Unsupported file type. Allowed: .jpg, .jpeg, .png, .webp");

        // Kreiraj folder ako ne postoji
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "attractions");
        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        // Jedinstveno ime
        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadPath, fileName);

        // Snimi
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Relativni URL za front ili za upis u bazu
        var relativePath = $"/images/attractions/{fileName}";
        return Ok(new { imageUrl = relativePath });
    }
}
