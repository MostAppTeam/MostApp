namespace RS1_2024_25.API.Data.Models
{
    public class AttractionOption
    {
        public int ID { get; set; }
        public int AttractionID { get; set; }   // FK na Attraction
        public string OptionType { get; set; }  // npr. "Tura", "Paketi"
        public string OptionValue { get; set; } // npr. "Virtual", "Physical", "Premium"
        public Attraction Attraction { get; set; }
    }
}
