using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Services;
using System.Threading.Tasks;


namespace RS1_2024_25.API.Controllers
{
    [ApiController]
    [Route("api/weather")]
    public class WeatherController : ControllerBase
    {
        private readonly WeatherService _weatherService;

        public WeatherController(WeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("{city}")]
        public async Task<IActionResult> GetWeather(string city)
        {
            var weather = await _weatherService.GetWeatherAsync(city);
            if (weather == null)
                return NotFound("Vremenska prognoza nije pronađena.");

            return Ok(weather);
        }
    }
}
