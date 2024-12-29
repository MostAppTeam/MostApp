using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Helper;
using RS1_2024_25.API.Services;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly EmailService _emailService;
    private static readonly Dictionary<string, string> TokenStorage = new Dictionary<string, string>();
    private readonly ILogger<AccountController> _logger;

    // DTO za zahtjeve
    public class EmailRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordModel
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

    public AccountController(EmailService emailService, ILogger<AccountController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost("send-activation-link")]
    public IActionResult SendActivationLink([FromBody] EmailRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Email) || !Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return BadRequest(new { message = "❌ Neispravan email format." });
        }

        var token = MyTokenGenerator.Generate(32);
        TokenStorage[request.Email] = token;

        var activationLink = $"https://localhost:7000/api/Account/activate?token={token}";

        try
        {
            _emailService.SendEmail(
                request.Email,
                "🔑 Aktivacija naloga",
                $"Kliknite na link za aktivaciju: <a href='{activationLink}'>Aktiviraj nalog</a>"
            );

            _logger.LogInformation($"✅ Aktivacijski link poslan na {request.Email}");
            return Ok(new { message = "✅ Aktivacijski link je poslan na e-mail." });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Greška prilikom slanja e-maila: {ex.Message}");
            return StatusCode(500, new { message = "❌ Greška prilikom slanja e-maila.", details = ex.Message });
        }
    }

    [HttpGet("activate")]
    public IActionResult ActivateAccount([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "❌ Token nije pronađen." });
        }

        foreach (var pair in TokenStorage)
        {
            if (pair.Value == token)
            {
                TokenStorage.Remove(pair.Key);
                _logger.LogInformation($"✅ Nalog za {pair.Key} je aktiviran.");
                return Ok(new { message = $"✅ Nalog za {pair.Key} je aktiviran." });
            }
        }

        _logger.LogWarning($"❌ Pokušaj aktivacije sa nevažećim tokenom: {token}");
        return BadRequest(new { message = "❌ Nevažeći token." });
    }

    [HttpPost("send-password-reset-link")]
    public IActionResult SendPasswordResetLink([FromBody] EmailRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Email) || !Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return BadRequest(new { message = "❌ Neispravan email format." });
        }

        var token = MyTokenGenerator.Generate(32);
        TokenStorage[request.Email] = token;

        var resetLink = $"http://localhost:7000/api/Account/reset-password?token={token}";

        try
        {
            _emailService.SendEmail(
                request.Email,
                "🔑 Resetovanje lozinke",
                $"Kliknite na link za resetovanje lozinke: <a href='{resetLink}'>Resetuj lozinku</a>"
            );

            _logger.LogInformation($"✅ Link za reset lozinke poslan na {request.Email}");
            return Ok(new { message = "✅ Link za reset lozinke je poslan na e-mail." });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Greška prilikom slanja e-maila: {ex.Message}");
            return StatusCode(500, new { message = "❌ Greška prilikom slanja e-maila.", details = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordModel model)
    {
        if (string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.NewPassword))
        {
            return BadRequest(new { message = "❌ Token i nova lozinka su obavezni." });
        }

        foreach (var pair in TokenStorage)
        {
            if (pair.Value == model.Token)
            {
                TokenStorage.Remove(pair.Key);
                _logger.LogInformation($"✅ Lozinka za {pair.Key} je resetovana.");
                return Ok(new { message = $"✅ Lozinka za {pair.Key} je resetovana." });
            }
        }

        _logger.LogWarning($"❌ Pokušaj resetovanja sa nevažećim tokenom: {model.Token}");
        return BadRequest(new { message = "❌ Nevažeći token." });
    }

    [HttpPost("send-invite")]
    public IActionResult SendInvite([FromBody] EmailRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Email) || !Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return BadRequest(new { message = "❌ Neispravan email format." });
        }

        var token = MyTokenGenerator.Generate(32);
        TokenStorage[request.Email] = token;

        var inviteLink = $"http://localhost:7000/api/Account/accept-invite?token={token}";

        try
        {
            _emailService.SendEmail(
                request.Email,
                "🎉 Pozivnica za pridruživanje",
                $"Kliknite na link za pridruživanje: <a href='{inviteLink}'>Prihvati poziv</a>"
            );

            _logger.LogInformation($"✅ Pozivnica poslana na {request.Email}");
            return Ok(new { message = "✅ Pozivnica je poslana na e-mail." });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Greška prilikom slanja e-maila: {ex.Message}");
            return StatusCode(500, new { message = "❌ Greška prilikom slanja e-maila.", details = ex.Message });
        }
    }

    [HttpGet("accept-invite")]
    public IActionResult AcceptInvite([FromQuery] string token)
    {
        foreach (var pair in TokenStorage)
        {
            if (pair.Value == token)
            {
                TokenStorage.Remove(pair.Key);
                _logger.LogInformation($"✅ Pozivnica za {pair.Key} je prihvaćena.");
                return Ok(new { message = $"✅ Pozivnica za {pair.Key} je prihvaćena." });
            }
        }

        _logger.LogWarning($"❌ Nevažeći token: {token}");
        return BadRequest(new { message = "❌ Nevažeći token." });
    }
}
