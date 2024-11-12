using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class Offer : IMyBaseEntity
    {
        public int ID { get; set; }
        public string OfferName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int TouristAgencyId { get; set; }
        public TouristAgency TouristAgency { get; set; }
    }
}
