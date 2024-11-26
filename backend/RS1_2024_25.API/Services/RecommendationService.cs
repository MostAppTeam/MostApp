namespace RS1_2024_25.API.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using RS1_2024_25.API.Data;
using System;


public class RecommendationService
{
    private readonly ApplicationDbContext _dbContext;

    public RecommendationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public List<Attraction> GetRecommendations(int userId)
    {
        var preferences = _dbContext.UserPreferences
            .Where(up => up.UserID == userId)
            .OrderByDescending(up => up.Weight)
            .Take(5)
            .ToList();

        var recommendedAttractions = _dbContext.Attractions
            .Where(a => preferences.Any(p => a.Name.Contains(p.Keyword)))
            .ToList();

        return recommendedAttractions;
    }
}
