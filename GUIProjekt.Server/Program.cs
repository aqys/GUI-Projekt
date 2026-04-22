using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/db/test", async (IConfiguration config) =>
{
    var connectionString = config.GetConnectionString("MySql");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Problem("Connection string mangler", statusCode: 500);
    }

    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();
        return Results.Ok(new { connected = true, serverVersion = connection.ServerVersion });
    }
    catch (Exception ex)
    {
        return Results.Problem($"db fejl: {ex.Message}", statusCode: 500);
    }
});

app.MapFallbackToFile("/index.html");

app.Run();
