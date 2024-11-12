using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class Museum : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
    }
}
