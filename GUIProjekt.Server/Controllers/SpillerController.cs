using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/spillere")]
public class SpillerController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public SpillerController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var connectionString = _configuration.GetConnectionString("MySql");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                return Problem("Connection string mangler", statusCode: 500);
            }

            await using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM spillere", connection);
            using var reader = await command.ExecuteReaderAsync();

            var spillere = new List<Spiller>();
            while (await reader.ReadAsync())
            {
                spillere.Add(new Spiller(reader.GetInt32("id"), reader.GetString("navn")));
            }

            return Ok(spillere);
        }
        catch (Exception ex)
        {
            return Problem($"Fejl ved hentning af spillere fra db: {ex.Message}", statusCode: 500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Spiller spiller)
    {
        var connectionString = _configuration.GetConnectionString("MySql");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return Problem("Connection string mangler", statusCode: 500);
        }

        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using var command = new MySqlCommand("INSERT INTO spillere (navn) VALUES (@navn)", connection);
        command.Parameters.AddWithValue("@navn", spiller.navn);

        await command.ExecuteNonQueryAsync();
        return Ok(new { success = true });
    }
}