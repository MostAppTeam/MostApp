namespace RS1_2024_25.API.Data.Models
{
    public class Media
    {
        public int ID { get; set; }

        public int OfferID { get; set; }
        public Offer Offer { get; set; }

        public int MuseumID { get; set; }
        public Museum Museum { get; set; }

        public int AttractionID { get; set; }
        public Attraction Attraction { get; set; }

        // Polja za multimedijske informacije
        public string FilePath { get; set; } // Putanja do slike ili videa
        public string MediaType { get; set; } // Npr. "image", "video"
        public string Description { get; set; } // Opis slike ili videa (opcionalno)
    }
}
