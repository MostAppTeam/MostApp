using RS1_2024_25.API.Helper;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Attraction : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CityID { get; set; }
        [Column("virtualtour")]
         public string? WorkingHours { get; set; }
        
        public string VirtualTourURL { get; set; }  
        public City? City { get; set; }

        // npr. "Museum", "Park", "Shopping Center"

[Column("imageurl")]
        public string? ImageUrl { get; set; }


        // NOVO
       
        public bool IsPaid { get; set; }  // Da li se plaća ulaz
        public List<AttractionOption> Options { get; set; } = new List<AttractionOption>();


    }
}
