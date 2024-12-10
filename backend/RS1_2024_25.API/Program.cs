using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Auth;
using RS1_2024_25.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Register your services
builder.Services.AddTransient<MyAuthService>();
builder.Services.AddScoped<RecommendationService>();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add DbContext service if you're using EF Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MostAppDB")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x => x.OperationFilter<MyAuthorizationSwaggerHeader>());
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Middleware and pipeline configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();
app.MapControllers();

// If no static files are being served, remove the line for static files middleware
// app.UseStaticFiles();  // This line should be commented out or removed if not using wwwroot

// Test database connection (this is a placeholder for your actual database testing logic)
Console.WriteLine("Database connection test skipped, no database connection available.");

app.Run();
