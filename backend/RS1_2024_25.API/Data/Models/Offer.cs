using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;

public class Offer : IMyBaseEntity
{
    public int ID { get; set; }
    public string OfferName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int TouristAgencyId { get; set; }
    public TouristAgency TouristAgency { get; set; }

    // Nova veza s kategorijom
    public int? CategoryID { get; set; }
    public Category Category { get; set; }

    public string Status { get; set; } // Aktivna, istečena, itd.
}
