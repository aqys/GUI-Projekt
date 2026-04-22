using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/db")]
public class DbController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public DbController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("test")]
    public async Task<IActionResult> Test()
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
            return Ok(new { connected = true, serverVersion = connection.ServerVersion });
        }
        catch (Exception ex)
        {
            return Problem($"db fejl: {ex.Message}", statusCode: 500);
        }
    }
}