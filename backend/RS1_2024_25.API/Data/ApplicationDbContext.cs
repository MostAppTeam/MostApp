using Microsoft.EntityFrameworkCore;
using PayPalCheckoutSdk.Orders;
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

        public DbSet<UserPreference>UserPreferences { get; set; }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
       // public DbSet<Media> Media { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Order> Orders { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracija decimalnog polja 'Price' u 'Offer' entitetu
            modelBuilder.Entity<Offer>()
                .Property(o => o.Price)
                .HasPrecision(18, 2); // 18 ukupnih cifara, 2 decimalna mjesta

            // Konfiguracija decimalnog polja 'TotalPrice' u 'Booking' entitetu
            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalPrice)
                .HasPrecision(18, 2); // 18 ukupnih cifara, 2 decimalna mjesta

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id); // Definišemo primarni ključ
            });
           
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
        }
    }
}
