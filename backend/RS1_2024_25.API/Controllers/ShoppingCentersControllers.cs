﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Helper.Auth;

namespace RS1_2024_25.API.Controllers
{
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
        public async Task<ActionResult<IEnumerable<ShoppingCenter>>> GetShoppingCenters(
            [FromQuery] string? name = null,
            [FromQuery] string sortBy = "name")
        {
            var shoppingCenters = _context.ShoppingCenters.AsQueryable();

            // Filtriranje
            if (!string.IsNullOrWhiteSpace(name))
            {
                shoppingCenters = shoppingCenters.Where(s => s.Name.Contains(name));
            }

            // Sortiranje
            shoppingCenters = sortBy switch
            {
                "name" => shoppingCenters.OrderBy(s => s.Name),
                _ => shoppingCenters.OrderBy(s => s.ID) // Defaultno sortiranje po ID-u
            };

            return Ok(await shoppingCenters.ToListAsync());
        }

        // GET: api/ShoppingCenters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShoppingCenter>> GetShoppingCenter(int id)
        {
            var shoppingCenter = await _context.ShoppingCenters.FindAsync(id);

            if (shoppingCenter == null)
            {
                return NotFound(new { Message = $"Shopping Center with ID {id} not found." });
            }

            return Ok(shoppingCenter);
        }

        // POST: api/ShoppingCenters
        [HttpPost]
        [MyAuthorization(isAdmin: true, isManager: true)]
        public async Task<ActionResult<ShoppingCenter>> PostShoppingCenter(ShoppingCenter shoppingCenter)
        {
            if (shoppingCenter == null)
            {
                return BadRequest(new { Message = "Shopping Center data is invalid." });
            }

            _context.ShoppingCenters.Add(shoppingCenter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShoppingCenter), new { id = shoppingCenter.ID }, shoppingCenter);
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
    }
}