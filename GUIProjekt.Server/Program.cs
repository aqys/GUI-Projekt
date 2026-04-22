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

app.MapFallbackToFile("/index.html");

app.Run();

public record Spiller(int id, string navn);
public record Kamp(int id, int spiller1, int spiller2, int score1, int score2);
public record KampDto(int id, string tidspunkt, string vinder, int vinderScore, string taber, int taberScore);
public record RegisterKampDto(string tidspunkt, string vinder, int vinderScore, string taber, int taberScore);

