using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

[ApiController]
[Route("api/v1/kampe")]
public class KampeController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private static readonly CultureInfo DanishCulture = CultureInfo.GetCultureInfo("da-DK");

    public KampeController(IConfiguration configuration)
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
            await EnsureTidspunktColumnAsync(connection);

            var sql = @"
                SELECT k.id, k.tidspunkt, k.score1, k.score2,
                       s1.navn as spiller1Navn, s2.navn as spiller2Navn
                FROM kampe k
                JOIN spillere s1 ON k.spiller1 = s1.id
                JOIN spillere s2 ON k.spiller2 = s2.id
                ORDER BY k.id DESC";

            using var command = new MySqlCommand(sql, connection);
            using var reader = await command.ExecuteReaderAsync();

            var kampe = new List<KampDto>();
            while (await reader.ReadAsync())
            {
                var p1Navn = reader.GetString("spiller1Navn");
                var p2Navn = reader.GetString("spiller2Navn");
                var score1 = reader.GetInt32("score1");
                var score2 = reader.GetInt32("score2");
                var id = reader.GetInt32("id");
                var tidspunkt = reader.GetDateTime("tidspunkt").ToString("dd-MM-yyyy HH:mm", DanishCulture);

                string vinder = score1 > score2 ? p1Navn : (score2 > score1 ? p2Navn : p1Navn);
                string taber = score1 > score2 ? p2Navn : (score2 > score1 ? p1Navn : p2Navn);
                int vinderScore = score1 > score2 ? score1 : (score2 > score1 ? score2 : score1);
                int taberScore = score1 > score2 ? score2 : (score2 > score1 ? score1 : score2);

                kampe.Add(new KampDto(id, tidspunkt, vinder, vinderScore, taber, taberScore));
            }

            return Ok(kampe);
        }
        catch (Exception ex)
        {
            return Problem($"Fejl ved hentning af kampe fra db: {ex.Message}", statusCode: 500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] RegisterKampDto input)
    {
        var connectionString = _configuration.GetConnectionString("MySql");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return Problem("Connection string mangler", statusCode: 500);
        }

        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();
        await EnsureTidspunktColumnAsync(connection);

        int? vinderId = null;
        int? taberId = null;

        try
        {
            using (var cmd = new MySqlCommand("SELECT id, navn FROM spillere WHERE navn IN (@vinder, @taber)", connection))
            {
                cmd.Parameters.AddWithValue("@vinder", input.vinder);
                cmd.Parameters.AddWithValue("@taber", input.taber);
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    if (reader.GetString("navn") == input.vinder)
                    {
                        vinderId = reader.GetInt32("id");
                    }

                    if (reader.GetString("navn") == input.taber)
                    {
                        taberId = reader.GetInt32("id");
                    }
                }
            }

            if (vinderId == null || taberId == null)
            {
                return BadRequest("Kunne ikke finde vinderen eller taberen i databasen");
            }

            var tidspunkt = ParseTidspunkt(input.tidspunkt);

            using var command = new MySqlCommand("INSERT INTO kampe (spiller1, spiller2, score1, score2, tidspunkt) VALUES (@s1, @s2, @sc1, @sc2, @tidspunkt)", connection);
            command.Parameters.AddWithValue("@s1", vinderId);
            command.Parameters.AddWithValue("@s2", taberId);
            command.Parameters.AddWithValue("@sc1", input.vinderScore);
            command.Parameters.AddWithValue("@sc2", input.taberScore);
            command.Parameters.AddWithValue("@tidspunkt", tidspunkt);

            await command.ExecuteNonQueryAsync();
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return Problem($"Fejl ved oprettelse af kampe: {ex.Message}", statusCode: 500);
        }
    }

    private static async Task EnsureTidspunktColumnAsync(MySqlConnection connection)
    {
        const string checkSql = @"
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'kampe'
              AND COLUMN_NAME = 'tidspunkt'";

        using var checkCommand = new MySqlCommand(checkSql, connection);
        var hasColumn = Convert.ToInt32(await checkCommand.ExecuteScalarAsync()) > 0;
        if (hasColumn)
        {
            return;
        }

        const string alterSql = @"
            ALTER TABLE kampe
            ADD COLUMN tidspunkt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER id";

        using var alterCommand = new MySqlCommand(alterSql, connection);
        await alterCommand.ExecuteNonQueryAsync();
    }

    private static DateTime ParseTidspunkt(string tidspunkt)
    {
        if (DateTime.TryParse(tidspunkt, DanishCulture, DateTimeStyles.AllowWhiteSpaces, out var parsedTidspunkt))
        {
            return parsedTidspunkt;
        }

        if (DateTime.TryParse(tidspunkt, CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out parsedTidspunkt))
        {
            return parsedTidspunkt;
        }

        return DateTime.Now;
    }
}