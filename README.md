# MajsterPro Market

Projekt do przedmiotu Projektowanie Mobilnych Aplikacji Biznesowych.

Temat aplikacji: sklep budowlano-remontowy dla klientów indywidualnych i ekip wykonawczych. Aplikacja pozwala zarządzać katalogiem materiałów budowlanych, narzędziami, klientami, pracownikami oraz zamówieniami.

## Technologie

- React Native - aplikacja mobilna w `SolutionOrdersMobile`
- ASP.NET Core Web API - backend w `SolutionOrders.API`
- Entity Framework Core + SQL Server
- MediatR/Mapster dla modułu produktów
- Docker Compose dla API i bazy danych

## Zakres modelu danych

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

Frontend mobilny zawiera panel administracyjny `MajsterPro Market`, w którym można wybrać jedną z 10 tabel, pobrać rekordy, dodać nowy rekord, edytować wybrany rekord i usunąć rekord. Zdjęcia użyte w aplikacji znajdują się w `SolutionOrdersMobile/src/assets/images`.
