using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;

public class Category : IMyBaseEntity
{
    public int ID { get; set; }
    public string Name { get; set; }

    // Veze prema drugim entitetima
    public ICollection<Offer> Offers { get; set; }
    public ICollection<Attraction> Attractions { get; set; }
}
