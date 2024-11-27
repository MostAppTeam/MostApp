using Microsoft.Extensions.DependencyInjection;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using System.Linq;

namespace RS1_2024_25.API.Data
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            // Kreiranje scoped opsega za pristup bazi podataka
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                // Provjera da li već postoje podaci u bazi
                if (!context.Countries.Any())
                {
                    // Dodavanje zemlje
                    context.Countries.Add(new Country { Name = "Bosna i Hercegovina" });
                    context.SaveChanges(); // Spremanje u bazu da bi dobili ID
                }

                if (!context.Cities.Any())
                {
                    // Dodavanje gradova povezano sa zemljom "Bosna i Hercegovina"
                    var countryId = context.Countries.First(c => c.Name == "Bosna i Hercegovina").ID;

                    context.Cities.AddRange(
                        new City { Name = "Mostar", CountryId = countryId },
                        new City { Name = "Sarajevo", CountryId = countryId },
                        new City { Name = "Banja Luka", CountryId = countryId }
                    );
                    context.SaveChanges();
                }

                if (!context.Museums.Any())
                {
                    context.Museums.AddRange(
                        new Museum { Name = "Museum of Herzegovina", Location = "Mostar Old Bazaar", Description = "A museum showcasing the history of Herzegovina with artifacts from the Ottoman and Austro-Hungarian periods." },
                        new Museum { Name = "Koski Mehmed Pasha Mosque", Location = "Koski Mehmed Pasha Mosque", Description = "A museum and mosque offering panoramic views of the Old Bridge and the Neretva River." }
                    );
                    context.SaveChanges();
                }

                if (!context.Attractions.Any())
                {
                    // Dohvati CityID za Mostar (pretpostavljamo da je Mostar ID=1)
                    var mostarCityId = context.Cities.First(c => c.Name == "Mostar").ID;

                    context.Attractions.AddRange(
                        new Attraction { Name = "Old Bridge", CityID = mostarCityId, Description = "A UNESCO World Heritage site, the Old Bridge is an iconic symbol of Mostar." },
                        new Attraction { Name = "Blagaj Tekke", CityID = mostarCityId, Description = "A historical Dervish house located near the Buna River, known for its beautiful architecture and scenic views." }
                    );
                    context.SaveChanges();
                }

                if (!context.ShoppingCenters.Any())
                {
                    // Dohvati CityID za Mostar (pretpostavljamo da je Mostar ID=1)
                    var mostarCityId = context.Cities.First(c => c.Name == "Mostar").ID;

                    context.ShoppingCenters.AddRange(
                        new ShoppingCenter { Name = "Mepas Mall", CityID = mostarCityId, Address = "Splitska bb, Mostar", WorkingHours = "Mon-Sat: 10:00 AM - 10:00 PM" },
                        new ShoppingCenter { Name = "Bazar Shopping Center", CityID = mostarCityId, Address = "Bazar bb, Mostar", WorkingHours = "Mon-Sun: 9:00 AM - 9:00 PM" }
                    );
                    context.SaveChanges();
                }

                if (!context.TouristAgencies.Any())
                {
                    // Dohvati CityID za Mostar (pretpostavljamo da je Mostar ID=1)
                    var mostarCityId = context.Cities.First(c => c.Name == "Mostar").ID;

                    context.TouristAgencies.AddRange(
                        new TouristAgency { Name = "Mostar Tours", CityID = mostarCityId, ContactInfo = "Phone: +387 36 555 555" },
                        new TouristAgency { Name = "Herzegovina Travel", CityID = mostarCityId, ContactInfo = "Phone: +387 36 444 444" }
                    );
                    context.SaveChanges();
                }

                if (!context.Offers.Any())
                {
                    context.Offers.AddRange(
                        new Offer { OfferName = "City Tour", Description = "A guided walking tour of the Old Town, including the Old Bridge, Koski Mehmed Pasha Mosque, and other landmarks.", Price = 30.0m, TouristAgencyId = 1 },
                        new Offer { OfferName = "Neretva Rafting Adventure", Description = "A thrilling rafting experience on the Neretva River, perfect for adventure lovers.", Price = 70.0m, TouristAgencyId = 2 }
                    );
                    context.SaveChanges();
                }

                if (!context.Events.Any())
                {
                    context.Events.AddRange(
                        new Event { Name = "Mostar Summer Festival", Date = "2024-06-10", Location = "Old Bridge Area", Description = "A cultural event featuring music, dance, and food celebrating Mostar's history and traditions." },
                        new Event { Name = "Old Bridge Diving Competition", Date = "2024-07-15", Location = "Old Bridge", Description = "An annual event where brave divers jump off the Old Bridge into the Neretva River." }
                    );
                    context.SaveChanges();
                }

                if (!context.UserPreferences.Any())
                {
                    var testUserId = context.MyAppUsers.First(u => u.Username == "testuser").ID;

                    context.UserPreferences.AddRange(
                        new UserPreference { UserID = testUserId, PreferenceType = "Attraction", Keyword = "Old Bridge", Weight = 9 },
                        new UserPreference { UserID = testUserId, PreferenceType = "Offer", Keyword = "City Tour", Weight = 7 },
                        new UserPreference { UserID = testUserId, PreferenceType = "Event", Keyword = "Summer Festival", Weight = 8 }
                    );
                    context.SaveChanges();
                }


            }
        }
    }
}
