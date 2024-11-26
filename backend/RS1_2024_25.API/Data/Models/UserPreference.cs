using RS1_2024_25.API.Helper;

public class UserPreference : IMyBaseEntity
{
    public int ID { get; set; }
    public int UserID { get; set; }
    public string PreferenceType { get; set; } // e.g., "Attraction", "Event"
    public string Keyword { get; set; } // e.g., "Museum", "Adventure"
    public int Weight { get; set; } // Importance of the preference
}
