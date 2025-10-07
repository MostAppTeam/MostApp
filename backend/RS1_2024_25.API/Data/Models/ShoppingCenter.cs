using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class ShoppingCenter : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string WorkingHours { get; set; }
        public int CityID { get; set; }
        public City City { get; set; }

        public TimeSpan OpeningTime { get; set; }
        public TimeSpan ClosingTime { get; set; }

        public string? ImageUrl { get; set; }

    }
}
