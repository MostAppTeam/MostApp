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
public class ShoppingCentersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ShoppingCentersController(ApplicationDbContext context)
    {
        _context = context;
    }

    public class ShoppingCenterDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string WorkingHours { get; set; }
        public string OpeningTime { get; set; } // HH:mm
        public string ClosingTime { get; set; } // HH:mm
        public int CityID { get; set; }
        public IFormFile? ImageFile { get; set; }
    }

    // GET: api/ShoppingCenters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingCenter>>> GetShoppingCenters(
        [FromQuery] string? name = null,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDirection = "asc")
    {
        var centers = _context.ShoppingCenters.AsQueryable();

        if (!string.IsNullOrEmpty(name))
            centers = centers.Where(c => c.Name.Contains(name));

        centers = sortBy.ToLower() switch
        {
            "name" => sortDirection.ToLower() == "desc" ? centers.OrderByDescending(c => c.Name) : centers.OrderBy(c => c.Name),
            "address" => sortDirection.ToLower() == "desc" ? centers.OrderByDescending(c => c.Address) : centers.OrderBy(c => c.Address),
            "workinghours" => sortDirection.ToLower() == "desc" ? centers.OrderByDescending(c => c.WorkingHours) : centers.OrderBy(c => c.WorkingHours),
            _ => centers.OrderBy(c => c.Name)
        };

        return Ok(await centers.ToListAsync());
    }

    // POST: api/ShoppingCenters
    [HttpPost]
    [Consumes("multipart/form-data")]
    [MyAuthorization(isAdmin: true, isManager: true)]
    public async Task<ActionResult<ShoppingCenter>> CreateShoppingCenter([FromForm] ShoppingCenterDto dto)
    {
        var shoppingCenter = new ShoppingCenter
        {
            Name = dto.Name,
            Address = dto.Address,
            WorkingHours = dto.WorkingHours,
            CityID = dto.CityID,
            OpeningTime = TimeSpan.Parse(dto.OpeningTime),
            ClosingTime = TimeSpan.Parse(dto.ClosingTime)
        };

        if (dto.ImageFile != null && dto.ImageFile.Length > 0)
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "shoppingcenters");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ImageFile.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }

            shoppingCenter.ImageUrl = $"/images/shoppingcenters/{fileName}";
        }

        _context.ShoppingCenters.Add(shoppingCenter);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShoppingCenters), new { id = shoppingCenter.ID }, shoppingCenter);
    }

    // PUT: api/ShoppingCenters/5
    [HttpPut("{id}")]
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<IActionResult> PutShoppingCenter(int id, ShoppingCenter shoppingCenter)
        {
            if (id != shoppingCenter.ID)
            {
                return BadRequest(new { Message = "Shopping Center ID in the URL does not match the ID in the payload." });
            }

            if (!_context.ShoppingCenters.Any(s => s.ID == id))
            {
                return NotFound(new { Message = $"Shopping Center with ID {id} not found." });
            }

            _context.Entry(shoppingCenter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { Message = "A concurrency error occurred while updating the shopping center." });
            }

            return NoContent();
        }

        // DELETE: api/ShoppingCenters/5
        [HttpDelete("{id}")]
        [MyAuthorization(isAdmin: true, isManager: false)]
        public async Task<IActionResult> DeleteShoppingCenter(int id)
        {
            var shoppingCenter = await _context.ShoppingCenters.FindAsync(id);
            if (shoppingCenter == null)
            {
                return NotFound(new { Message = $"Shopping Center with ID {id} not found." });
            }

            _context.ShoppingCenters.Remove(shoppingCenter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("upload-image")]
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "shoppingcenters");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"/images/shoppingcenters/{fileName}";

            return Ok(new { imageUrl = relativePath });
        }

    }
