using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Auth;
using RS1_2024_25.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure services and dependencies
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MostAppDB")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x => x.OperationFilter<MyAuthorizationSwaggerHeader>());
builder.Services.AddHttpContextAccessor();

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

var app = builder.Build();

// Middleware and pipeline configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();
app.MapControllers();

// Test database connection
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        if (context.Database.CanConnect())
        {
            Console.WriteLine("Connection to the database successful!");
        }
        else
        {
            Console.WriteLine("Failed to connect to the database.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection error: {ex.Message}");
    }
}

app.Run();
