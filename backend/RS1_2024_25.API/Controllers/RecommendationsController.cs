using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Services;
using System.Collections.Generic;
using RS1_2024_25.API.Data.Models;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly RecommendationService _recommendationService;

    public RecommendationsController(RecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    /// <summary>
    /// Dobij preporuke za korisnika na osnovu preferenci.
    /// </summary>
    /// <param name="userId">ID korisnika</param>
    /// <returns>Lista preporučenih atrakcija, događaja i ponuda.</returns>
    [HttpGet("{userId}")]
    public ActionResult<List<RecommendationDto>> GetRecommendations(int userId)
    {
        // Validacija ulaznog parametra
        if (userId <= 0)
        {
            return BadRequest(new { message = "Invalid user ID. It must be a positive number." });
        }

        // Preuzimanje preporuka iz servisa
        var recommendations = _recommendationService.GetRecommendations(userId);

        if (recommendations == null || recommendations.Count == 0)
        {
            return NotFound(new { message = "No recommendations found for this user." });
        }

        return Ok(recommendations);
    }
}
