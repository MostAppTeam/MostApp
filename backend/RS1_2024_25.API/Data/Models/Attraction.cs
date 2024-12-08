using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper;

public class Attraction : IMyBaseEntity
{
<<<<<<< HEAD
    public int ID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int CityID { get; set; }
    public City City { get; set; }

    // Nova veza s kategorijom
    public int? CategoryID { get; set; }
    public Category Category { get; set; }

    public string WorkingHours { get; set; }
    public decimal? TicketPrice { get; set; }
=======
    public class Attraction : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CityID { get; set; }
        public string VirtualTourURL {  get; set; }
        public City City { get; set; }
    }
>>>>>>> main
}
