using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using PayPalCheckoutSdk.Orders;




namespace RS1_2024_25.API.Services
{
    public class PayPalPaymentService
    {
        private readonly IConfiguration _configuration;

        public PayPalPaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> CreateOrderAsync(string offerName, decimal amount)
        {
            var client = GetPayPalHttpClient();

            var orderRequest = new OrderRequest
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new List<PurchaseUnitRequest>
            {
                new PurchaseUnitRequest
                {
                    AmountWithBreakdown = new AmountWithBreakdown
                    {
                        CurrencyCode = "USD",
                        Value = amount.ToString("F2")
                    },
                    Description = offerName
                }
            },
                ApplicationContext = new ApplicationContext
                {
                    ReturnUrl = "https://yourapp.com/success",
                    CancelUrl = "https://yourapp.com/cancel"
                }
            };

            var request = new OrdersCreateRequest();
            request.RequestBody(orderRequest);

            var response = await client.Execute(request);
            if (response.StatusCode == System.Net.HttpStatusCode.Created)
            {
                var result = response.Result<Order>();
                return result.Links.FirstOrDefault(link => link.Rel == "approve")?.Href;
            }

            throw new Exception("Failed to create PayPal order.");
        }

        private PayPalHttpClient GetPayPalHttpClient()
        {
            var environment = new PayPalCheckoutSdk.Core.SandboxEnvironment(
                _configuration["PayPal:ClientId"],
                _configuration["PayPal:Secret"]
            );

            return new PayPalHttpClient(environment);
        }
       

        public async Task<string> CaptureOrderAsync(string orderId)
    {
        var client = GetPayPalHttpClient();

        var request = new OrdersCaptureRequest(orderId);
        request.RequestBody(new OrderActionRequest());

        var response = await client.Execute(request);
        if (response.StatusCode == System.Net.HttpStatusCode.Created)
        {
            return "Payment captured successfully!";
        }

        throw new Exception("Failed to capture payment.");
    }

}

}
