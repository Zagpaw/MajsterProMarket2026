# MajsterPro Market

Projekt do przedmiotu Projektowanie Mobilnych Aplikacji Biznesowych.

Temat aplikacji: sklep budowlano-remontowy dla klientów indywidualnych i ekip wykonawczych. Aplikacja pozwala zarządzać katalogiem materiałów budowlanych, narzędziami, klientami, pracownikami, dostawcami, magazynami oraz zamówieniami.

## Technologie

- React Native - aplikacja mobilna w `SolutionOrdersMobile`
- ASP.NET Core Web API - backend w `SolutionOrders.API`
- Entity Framework Core + SQL Server
- Docker Compose dla API i bazy danych
- Swagger/OpenAPI do testowania endpointów

## Co jest w projekcie

Projekt zawiera 10 tabel/klas biznesowych:

- `UnitOfMeasurement` - jednostki miary, np. szt., kg, l
- `Category` - działy sklepu, np. materiały budowlane, narzędzia
- `Client` - klienci sklepu i ekipy remontowe
- `Worker` - pracownicy sklepu
- `Supplier` - dostawcy materiałów i narzędzi
- `Brand` - marki produktów
- `Warehouse` - magazyny sklepu
- `Item` - produkty budowlane i narzędzia
- `Order` - zamówienia klientów
- `OrderItem` - pozycje zamówień

## Relacje

Relacje 1 do wielu:

- `Category` -> wiele `Item`
- `UnitOfMeasurement` -> wiele `Item`
- `Supplier` -> wiele `Item`
- `Brand` -> wiele `Item`
- `Warehouse` -> wiele `Item`
- `Client` -> wiele `Order`
- `Worker` -> wiele `Order`
- `Order` -> wiele `OrderItem`

Relacja wiele do wiele:

- `Order` <-> `Item` przez tabelę łączącą `OrderItem`

## CRUD

Backend udostępnia pełny CRUD przez kontrolery:

- `api/Item`
- `api/Category`
- `api/UnitOfMeasurement`
- `api/Client`
- `api/Worker`
- `api/Supplier`
- `api/Brand`
- `api/Warehouse`
- `api/Order`
- `api/OrderItem`

Frontend mobilny zawiera:

- logowanie administratora
- rejestrację i logowanie klienta
- panel administratora z CRUD dla 10 tabel
- katalog produktów klienta
- koszyk
- składanie zamówień
- fikcyjną płatność kartą albo płatność przy odbiorze
- podgląd zamówień klienta

Zdjęcia użyte w aplikacji znajdują się w:

```text
SolutionOrdersMobile/src/assets/images
```

## Dane startowe

Seeder w `ApplicationDbContext` tworzy przykładowe dane:

- kategorie
- jednostki
- klientów
- pracowników
- dostawców
- marki
- magazyny
- 10 produktów w katalogu

Konto administratora:

```text
login: pawel
hasło: haslo.123
```

Klient może też założyć własne konto w aplikacji mobilnej.

## Uruchomienie API i bazy przez Docker

Wymagania:

- Docker Desktop
- wolne porty `5000` i `1433`

W głównym folderze projektu uruchom:

```powershell
docker compose -f docker-compose-api.yml up --build
```

Po uruchomieniu API jest dostępne tutaj:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/swagger
```

Przykładowe endpointy:

```text
http://localhost:5000/api/Item
http://localhost:5000/api/Brand
http://localhost:5000/api/Category
http://localhost:5000/api/Order
```

Migracje bazy danych uruchamiają się automatycznie przy starcie API, a seeder dodaje dane startowe.

## Uruchomienie API lokalnie bez konteneryzowania API

Można też uruchomić samą bazę w Dockerze:

```powershell
docker compose -f docker-compose-api.yml up -d sqlserver
```

Następnie uruchomić API lokalnie:

```powershell
cd SolutionOrders.API
$env:ASPNETCORE_URLS="http://localhost:5000"
dotnet run --no-launch-profile
```

## Uruchomienie aplikacji mobilnej Android

Wymagania:

- Node.js 22 lub nowszy
- Android Studio
- uruchomiony emulator Androida
- działające API na `http://localhost:5000`

W folderze aplikacji mobilnej:

```powershell
cd SolutionOrdersMobile
npm install
adb reverse tcp:5000 tcp:5000
adb reverse tcp:8081 tcp:8081
npm start -- --reset-cache
```

W drugim terminalu:

```powershell
cd SolutionOrdersMobile
npm run android
```

## Co wysłać nauczycielowi

Najlepiej wysłać cały folder projektu jako archiwum ZIP, ale bez katalogów generowanych:

- nie trzeba wysyłać `node_modules`
- nie trzeba wysyłać `bin`
- nie trzeba wysyłać `obj`
- nie trzeba wysyłać `.vs`

W paczce powinny zostać:

- `SolutionOrders.API`
- `SolutionOrdersMobile`
- `docker-compose-api.yml`
- `docker-compose-db.yml`
- `PMAB2026Zaoczki.slnx`
- `README.md`
- folder `SolutionOrdersMobile/src/assets/images`
