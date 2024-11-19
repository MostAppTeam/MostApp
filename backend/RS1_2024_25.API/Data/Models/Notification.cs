namespace RS1_2024_25.API.Data.Models
{
    public class Notification
    {
        public int ID { get; set; }

        // Veza sa korisnikom koji treba da primi obaveštenje
        public int UserID { get; set; }
        public User User { get; set; }

        // Tip notifikacije (npr. nova ponuda, novi događaj, nova atrakcija)
        public string NotificationType { get; set; }

        // Tekst obavještenja
        public string Message { get; set; }

        // Datum i vrijeme kada je obavještenje poslato
        public DateTime CreatedDate { get; set; }

        // Status obavještenja (npr. pročitano, nije pročitano)
        public bool IsRead { get; set; }
    }
}
