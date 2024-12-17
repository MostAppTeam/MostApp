using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        // Add more validation logic here if needed
        public string Email {  get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password should be at least 6 characters.")]
        public string Password { get; set; }

        public bool IsAdmin { get; set; } = false;
        public bool IsManager { get; set; } = false;
    }

}
