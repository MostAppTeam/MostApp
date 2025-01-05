using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.Auth.AuthLoginEndpoint;

namespace RS1_2024_25.API.Endpoints.Auth
{
    [Route("auth")]
    public class AuthLoginEndpoint(ApplicationDbContext db, MyAuthService authService) : MyEndpointBaseAsync
        .WithRequest<LoginRequest>
        .WithActionResult<LoginResponse>
    {
        [HttpPost("login")]
        public override async Task<ActionResult<LoginResponse>> HandleAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            // Pronađi korisnika prema korisničkom imenu
            var loggedInUser = await db.MyAppUsers.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

            if (loggedInUser == null)
            {
                return Unauthorized(new { Message = "Incorrect username or password" });
            }

            // Provjera lozinke
            var passwordHasher = new PasswordHasher<MyAppUser>();
            var result = passwordHasher.VerifyHashedPassword(loggedInUser, loggedInUser.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { Message = "Incorrect username or password" });
            }

            // Generiši token
            var newAuthToken = await authService.GenerateAuthToken(loggedInUser, cancellationToken);
            var authInfo = authService.GetAuthInfo(newAuthToken);

            Console.WriteLine($"AuthInfo: {authInfo.Username}, {authInfo.Email}");

            return new LoginResponse
            {
                Token = newAuthToken.Value,
                MyAuthInfo = authInfo
            };
        }

        public class LoginRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        public class LoginResponse
        {
            public required MyAuthInfo? MyAuthInfo { get; set; }
            public string Token { get; internal set; }
        }
    }
}
