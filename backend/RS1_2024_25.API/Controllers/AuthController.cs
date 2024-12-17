using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Data.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

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
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid input", Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            // Check for required fields
            if (string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { Message = "Password cannot be null or empty." });
            }

            // Validate email format (if email field is part of the DTO)
            if (!Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return BadRequest(new { Message = "Invalid email format." });
            }

            // Ensure username uniqueness
            if (_context.MyAppUsers.Any(u => u.Username == dto.Username))
            {
                return BadRequest(new { Message = "Username already exists." });
            }

            // Validate password strength
            var passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            if (!passwordRegex.IsMatch(dto.Password))
            {
                return BadRequest(new { Message = "Password must be at least 8 characters long and include a letter, number, and special character (@$!%*?&)." });
            }

            // Create user and hash password
            var user = new MyAppUser
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                IsAdmin = dto.IsAdmin,
                IsManager = dto.IsManager,
            };

            var passwordHasher = new PasswordHasher<MyAppUser>();
            user.Password = passwordHasher.HashPassword(user, dto.Password);

            // Add user to the database
            _context.MyAppUsers.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
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
