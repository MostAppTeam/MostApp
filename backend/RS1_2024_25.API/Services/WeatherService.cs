using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace RS1_2024_25.API.Services
{

    public class WeatherService
    {
        private readonly HttpClient _httpClient;
        private const string ApiUrl = "https://api.openweathermap.org/data/2.5/weather";

        //private const string  ApiUrl = "http://localhost:7000/api/weather";

        private const string ApiKey = "fc0a60b413973360eb1206b4ddb1836e"; 

        public WeatherService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<WeatherResponse> GetWeatherAsync(string city)
        {
            var response = await _httpClient.GetAsync($"{ApiUrl}?q={city}&units=metric&appid={ApiKey}");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<WeatherResponse>(json);
            }
            return null;
        }
    }

    public class WeatherResponse
    {
        public MainData Main { get; set; }
        public WeatherInfo[] Weather { get; set; }
    }

    public class MainData
    {
        public float Temp { get; set; }
        public int Humidity { get; set; }
    }

    public class WeatherInfo
    {
        public string Description { get; set; }
    }

}
