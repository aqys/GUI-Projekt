# Turneringshåndterings-Webapp

## Værktøj

- Node.js - 24 LTS
- .NET - 10.0
- MySQL - 15.1

## For at køre projektet

```bash
cd ./guiprojekt.client
npm install
cd ..
cd ./GUIProjekt.Server
dotnet run --launch-profile https
```

## Database

Jeg bruger MySQL via connection string i:

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

`Opdater løbende`

- [x] Tilføj stores
- [x] Opdater komponenter til at hente data fra stores
- [x] Tilføj nye komponenter og style dem
- [x] Tilføj logik i de nye komponenter
- [x] Koble op til DB
- [x] Gem data i DB
- [x] Arbejdt lidt mere på UI delen
- [x] Videreudvikle home page
- [x] Sæt routing op
- [x] Tilføj ikoner
- [x] CRUD
- [x] Input validation og error handling
- [x] Code splitting
- [ ] Grafer
- [ ] Responsivt UI
- [ ] Unit tests?
- [ ] Arkitektur diagram
- [ ] Auth (maybe)
- [ ] Tjek alt igennem
- [ ] Færdiggør README/Dokumentation
