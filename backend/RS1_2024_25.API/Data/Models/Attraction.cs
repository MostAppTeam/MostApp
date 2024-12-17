using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class Attraction : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CityID { get; set; }
        public string WorkingHours { get; set; }
        public string VirtualTourURL { get; set; }  // Kolona već postoji
        public City City { get; set; }
    }
}
