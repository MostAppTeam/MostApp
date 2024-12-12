using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Models
{
    public class Order : IMyBaseEntity
    {
        public int ID { get; set; } // Primarni ključ (treba biti prepoznat)
        public string OrderId { get; set; } // PayPal Order ID
        public string OfferName { get; set; } // Naziv ponude
        public decimal Amount { get; set; } // Iznos
        public int UserId { get; set; } // ID korisnika
        public DateTime OrderDate { get; set; } // Datum narudžbe
        public bool IsPaid { get; set; } // Status plaćanja
    }
}
