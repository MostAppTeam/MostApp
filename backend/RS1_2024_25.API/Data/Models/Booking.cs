namespace RS1_2024_25.API.Data.Models
{
    public class Booking
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }
        public int OfferID { get; set; }
        public Offer Offer { get; set; }
        public int EventID { get; set; }
        public Event Event { get; set; }
        public DateTime BookingDate { get; set; } // Datum kreiranja rezervacije
        public string Status { get; set; } // npr. "Pending", "Confirmed", "Cancelled"
        public decimal TotalPrice { get; set; }

    }
}
