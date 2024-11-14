using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Data.Models;
using Microsoft.AspNetCore.Identity;

namespace RS1_2024_25.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly MyAuthService _authService;

        public AuthController(ApplicationDbContext context, MyAuthService authService)
        {
            _context = context;
            _authService = authService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest("Password cannot be null or empty.");
            }

            if (_context.MyAppUsers.Any(u => u.Username == dto.Username))
                return BadRequest("Username already exists.");

            var passwordHasher = new PasswordHasher<MyAppUser>();
            var hashedPassword = passwordHasher.HashPassword(null, dto.Password);

            var user = new MyAppUser
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IsAdmin = dto.IsAdmin,
                IsManager = dto.IsManager,
                Password = hashedPassword
            };

            _context.MyAppUsers.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.MyAppUsers.FirstOrDefault(u => u.Username == dto.Username);
            if (user == null)
                return Unauthorized("Invalid username or password.");

            var passwordHasher = new PasswordHasher<MyAppUser>();
            var verificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);

            if (verificationResult != PasswordVerificationResult.Success)
                return Unauthorized("Invalid username or password.");

            var authToken = await _authService.GenerateAuthToken(user);
            return Ok(new { token = authToken.Value });
        }



    }
}
