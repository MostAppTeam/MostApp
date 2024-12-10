namespace RS1_2024_25.API.Data.Models
{
    public class ActivityLog
    {
        public int ID { get; set; }

        // Veza sa korisnikom koji je izvršio akciju
        public int UserID { get; set; }
        public User User { get; set; }

        // Tip aktivnosti (npr. login, pregled ponude, rezervacija itd.)
        public string ActionType { get; set; }

        // Detalji o aktivnosti (npr. naziv ponude, ID atrakcije itd.)
        public string ActionDetails { get; set; }

        // Datum i vrijeme kada je aktivnost obavljena
        public DateTime ActionDate { get; set; }
    }
}
