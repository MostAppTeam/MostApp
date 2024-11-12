using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class Attraction : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CityID { get; set; }
        public City City { get; set; }
    }
}
