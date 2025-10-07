using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Auth;
using System.IO;
using Microsoft.AspNetCore.Http;

[Route("api/[controller]")]
[ApiController]
public class MuseumsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MuseumsController(ApplicationDbContext context)
    {
        _context = context;
    }

    public class MuseumDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public IFormFile? ImageFile { get; set; }
    }

    // GET: api/Museums
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Museum>>> GetMuseums(
        [FromQuery] string? name = null,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDirection = "asc")
    {
        var museums = _context.Museums.AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            museums = museums.Where(m => m.Name.Contains(name));
        }

        museums = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Name)
                        : museums.OrderBy(m => m.Name),
            "location" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Location)
                        : museums.OrderBy(m => m.Location),
            "description" => sortDirection.ToLower() == "desc"
                        ? museums.OrderByDescending(m => m.Description)
                        : museums.OrderBy(m => m.Description),
            _ => museums.OrderBy(m => m.Name)
        };

        return Ok(await museums.ToListAsync());
    }

    // GET: api/Museums/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Museum>> GetMuseumById(int id)
    {
        var museum = await _context.Museums.FindAsync(id);
        if (museum == null)
        {
            return NotFound();
        }

        return Ok(museum);
    }

    // POST: api/Museums - Dodavanje novog muzeja sa slikom
    [HttpPost]
    [Consumes("multipart/form-data")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<ActionResult<Museum>> CreateMuseum([FromForm] MuseumDto museumDto)
    {
        var museum = new Museum
        {
            Name = museumDto.Name,
            Location = museumDto.Location,
            Description = museumDto.Description
        };

        if (museumDto.ImageFile != null && museumDto.ImageFile.Length > 0)
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "museums");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(museumDto.ImageFile.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await museumDto.ImageFile.CopyToAsync(stream);
            }

            museum.ImageUrl = $"/images/museums/{fileName}";
        }


        _context.Museums.Add(museum);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMuseumById), new { id = museum.ID }, museum);
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<IActionResult> UpdateMuseum(int id, [FromForm] MuseumDto museumDto)
    {
        var museum = await _context.Museums.FindAsync(id);
        if (museum == null)
            return NotFound(new { message = "Museum not found." });

        // Ažuriraj osnovne podatke
        museum.Name = museumDto.Name ?? museum.Name;
        museum.Location = museumDto.Location ?? museum.Location;
        museum.Description = museumDto.Description ?? museum.Description;

        // Ako dolazi fajl, snimi ga u wwwroot/images/museums
        if (museumDto.ImageFile != null && museumDto.ImageFile.Length > 0)
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "museums");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(museumDto.ImageFile.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await museumDto.ImageFile.CopyToAsync(stream);
            }

            museum.ImageUrl = $"/images/museums/{fileName}";
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Museum updated successfully.", museum });
    }


    // DELETE: api/Museums/5
    [HttpDelete("{id}")]
    [MyAuthorization(isAdmin: true, isManager: true)]
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

    [HttpPost("upload-image")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Folder za slike muzeja
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "museums");
        if (!Directory.Exists(uploadPath))
            Directory.CreateDirectory(uploadPath);

        // Generiranje jedinstvenog imena datoteke
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadPath, fileName);

        // Spremanje datoteke
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Relativna putanja koja se šalje frontend-u
        var relativePath = $"/images/museums/{fileName}";

        return Ok(new { imageUrl = relativePath });
    }


}
