using System.Collections.Generic;
using System.Linq;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data;

public class RecommendationService
{
    private readonly ApplicationDbContext _dbContext;

    public RecommendationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public List<RecommendationDto> GetRecommendations(int userId)
    {
        var preferences = _dbContext.UserPreferences
            .Where(up => up.UserID == userId)
            .OrderByDescending(up => up.Weight)
            .Take(5)
            .ToList();

        if (!preferences.Any())
            return new List<RecommendationDto>();

        var recommendations = new List<RecommendationDto>();

        foreach (var preference in preferences)
        {
            if (preference.PreferenceType == "Attraction")
            {
                recommendations.AddRange(_dbContext.Attractions
                    .Where(a => a.Name.Contains(preference.Keyword))
                    .Select(a => new RecommendationDto
                    {
                        Id = a.ID,
                        Name = a.Name,
                        Description = a.Description
                    }).ToList());
            }
            else if (preference.PreferenceType == "Event")
            {
                recommendations.AddRange(_dbContext.Events
                    .Where(e => e.Name.Contains(preference.Keyword))
                    .Select(e => new RecommendationDto
                    {
                        Id = e.ID,
                        Name = e.Name,
                        Description = e.Description
                    }).ToList());
            }
            else if (preference.PreferenceType == "Offer")
            {
                recommendations.AddRange(_dbContext.Offers
                    .Where(o => o.OfferName.Contains(preference.Keyword))
                    .Select(o => new RecommendationDto
                    {
                        Id = o.ID,
                        Name = o.OfferName,
                        Description = o.Description
                    }).ToList());
            }
        }

        return recommendations;
    }

}
