using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using System.Linq;

namespace RS1_2024_25.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<MyAppUser> MyAppUsers { get; set; }
        public DbSet<MyAuthenticationToken> MyAuthenticationTokens { get; set; }

        public DbSet<Attraction> Attractions { get; set; }
        public DbSet<Museum> Museums { get; set; }
        public DbSet<ShoppingCenter> ShoppingCenters { get; set; }
        public DbSet<TouristAgency> TouristAgencies { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracija decimalnih polja
            modelBuilder.Entity<Offer>()
                .Property(o => o.Price)
                .HasPrecision(18, 2); // 18 ukupnih cifara, 2 decimalna mjesta

            modelBuilder.Entity<Attraction>()
                .Property(a => a.TicketPrice)
                .HasPrecision(18, 2); // 18 ukupnih cifara, 2 decimalna mjesta

            // Onemogućavamo automatsko brisanje povezanih entiteta
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
        }
    }
}
