using RS1_2024_25.API.Helper;

public class User : IMyBaseEntity
{
    public int ID { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set; }

    // Dodano
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; }

    // Veza s rezervacijama (ako je relevantno)
   // public ICollection<Reservation> Reservations { get; set; }
}
