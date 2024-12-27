using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Services;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Data.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using static RS1_2024_25.API.Endpoints.Auth.AuthLoginEndpoint;

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
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid input", Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            // Validate password
            if (string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { Message = "Password cannot be null or empty." });
            }

            var passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            if (!passwordRegex.IsMatch(dto.Password))
            {
                return BadRequest(new { Message = "Password must be at least 8 characters long and include a letter, number, and special character (@$!%*?&)." });
            }

            // Validate email format
            if (!Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return BadRequest(new { Message = "Invalid email format." });
            }

            // Ensure username uniqueness
            if (_context.MyAppUsers.Any(u => u.Username == dto.Username))
            {
                return BadRequest(new { Message = "Username already exists." });
            }

            // Create user
            var user = new MyAppUser
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                IsAdmin = dto.IsAdmin,
                IsManager = dto.IsManager
            };

            var passwordHasher = new PasswordHasher<MyAppUser>();
            user.Password = passwordHasher.HashPassword(user, dto.Password);

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

            var user = await _context.MyAppUsers.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
                return Unauthorized("Invalid username or password.");

            var passwordHasher = new PasswordHasher<MyAppUser>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid username or password.");
            }

            var authToken = await _authService.GenerateAuthToken(user);

            var userRole = user.IsAdmin ? "Admin" : user.IsManager ? "Manager" : "User";

            return Ok(new
            {
                Token = authToken.Value,
                UserInfo = new
                {
                    user.Username,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    Role = userRole
                }
            });
        }


    }
}