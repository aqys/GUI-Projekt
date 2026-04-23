# Turneringshåndterings-Webapp

## Værktøj

- Node.js - 22 LTS
- .NET - 10.0

## For at køre projektet

```bash
cd ./guiprojekt.client
npm install
cd ..
cd ./GUIProjekt.Server
dotnet run --launch-profile https
```

## Database (meget simpelt)

Vi bruger MySQL via connection string i:

- `GUIProjekt.Server/appsettings.json`

Nuværende opsætning:

- Host: `127.0.0.1`
- Port: `3306`
- Database: `tunering`
- Login (User): `tuneringskonto`
- Password: `AdminTest123!`

Connection string:

```text
Server=127.0.0.1;Port=3306;Database=tunering;User=tuneringskonto;Password=AdminTest123!;SslMode=None;
```

## TODO

- [x] Tilføj stores
- [x] Opdater komponenter til at hente data fra stores
- [x] Tilføj nye komponenter og style dem
- [x] Tilføj logik i de nye komponenter
- [x] Koble op til DB
- [x] Gem data i DB
- [x] Arbejdt lidt mere på UI delen
- [ ] Videreudvikle home page
