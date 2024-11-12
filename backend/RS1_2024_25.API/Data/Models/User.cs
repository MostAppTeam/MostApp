using RS1_2024_25.API.Helper;

namespace RS1_2024_25.API.Data.Models
{
    public class User : IMyBaseEntity
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
    }
}
