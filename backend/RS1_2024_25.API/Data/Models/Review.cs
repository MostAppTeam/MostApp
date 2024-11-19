namespace RS1_2024_25.API.Data.Models
{
    public class Review
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }

        public int OfferID { get; set; }
        public Offer Offer { get; set; }

        public int EventID { get; set; }
        public Event Event { get; set; }

        public int AttractionID { get; set; }
        public Attraction Attraction { get; set; }

        // Podaci o recenziji
        public int Rating { get; set; } // Ocjena: 1-5
        public string Comment { get; set; } // Komentar korisnika
        public DateTime ReviewDate { get; set; }
    }
}
