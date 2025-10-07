using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Auth;
using RS1_2024_25.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddTransient<MyAuthService>();
builder.Services.AddScoped<RecommendationService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MostAppDB")));



builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    x.OperationFilter<MyAuthorizationSwaggerHeader>(); // Već imaš ovu liniju
    x.OperationFilter<Swagger>(); // Dodaj ovu liniju za podršku file upload-a
});


builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<PayPalPaymentService>();
builder.Services.AddScoped<EmailService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin"); // Omogući CORS prvo
app.UseHttpsRedirection(); // Zatim HTTPS


app.UseAuthentication(); // Prvo autentifikacija
app.UseAuthorization();  // Zatim autorizacija

app.UseStaticFiles();

app.MapControllers(); // Na kraju mapiranje kontrolera



Console.WriteLine("✅ Backend je pokrenut i spreman za zahtjeve.");
app.Run();
