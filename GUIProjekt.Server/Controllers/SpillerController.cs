using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/v1/spillere")]
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
        if (string.IsNullOrWhiteSpace(spiller.navn))
        {
            return BadRequest("Navn må ikke være tomt");
        }

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

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] Spiller spiller)
    {
        if (string.IsNullOrWhiteSpace(spiller.navn))
        {
            return BadRequest("Navn må ikke være tomt");
        }

        var connectionString = _configuration.GetConnectionString("MySql");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return Problem("Connection string mangler", statusCode: 500);
        }

        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using var command = new MySqlCommand("UPDATE spillere SET navn = @navn WHERE id = @id", connection);
        command.Parameters.AddWithValue("@id", id);
        command.Parameters.AddWithValue("@navn", spiller.navn.Trim());

        var rowsAffected = await command.ExecuteNonQueryAsync();
        if (rowsAffected == 0)
        {
            return NotFound($"Spiller med id {id} findes ikke");
        }

        return Ok(new { success = true });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var connectionString = _configuration.GetConnectionString("MySql");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return Problem("Connection string mangler", statusCode: 500);
        }

        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using (var checkCommand = new MySqlCommand("SELECT COUNT(*) FROM kampe WHERE spiller1 = @id OR spiller2 = @id", connection))
        {
            checkCommand.Parameters.AddWithValue("@id", id);
            var hasKampe = Convert.ToInt32(await checkCommand.ExecuteScalarAsync()) > 0;
            if (hasKampe)
            {
                return Conflict("Spilleren kan ikke slettes, da der findes kampe registreret på spilleren");
            }
        }

        using var deleteCommand = new MySqlCommand("DELETE FROM spillere WHERE id = @id", connection);
        deleteCommand.Parameters.AddWithValue("@id", id);
        var rowsAffected = await deleteCommand.ExecuteNonQueryAsync();
        if (rowsAffected == 0)
        {
            return NotFound($"Spiller med id {id} findes ikke");
        }

        return Ok(new { success = true });
    }
}