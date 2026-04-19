using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SolutionOrders.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreCatalogItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "IdItem", "Code", "Description", "FotoUrl", "IdBrand", "IdCategory", "IdSupplier", "IdUnitOfMeasurement", "IdWarehouse", "IsActive", "Name", "Price", "Quantity" },
                values: new object[,]
                {
                    { 3, "BUD-FAR-10", "Matowa farba do ścian i sufitów", null, 1, 1, 1, 3, 1, true, "Farba biała lateksowa 10 l", 119m, 42m },
                    { 4, "BUD-PAN-DAB", "Panel laminowany AC4 do salonu i korytarza", null, 1, 1, 1, 1, 1, true, "Panel podłogowy dąb naturalny", 46m, 260m },
                    { 5, "BUD-DRZ-80", "Proste drzwi pokojowe z ościeżnicą", null, 1, 1, 1, 1, 1, true, "Drzwi wewnętrzne białe 80 cm", 399m, 14m },
                    { 6, "BUD-GRE-6060", "Gres do łazienki, kuchni i przedpokoju", null, 1, 1, 1, 1, 1, true, "Płytki gresowe szare 60x60", 79m, 180m },
                    { 7, "BUD-KLE-25", "Klej do gresu i glazury, do wnętrz i na zewnątrz", null, 1, 1, 1, 2, 1, true, "Klej do płytek elastyczny 25 kg", 54m, 95m },
                    { 8, "NAR-SDS-PLUS", "Młotowiertarka do cięższych prac remontowych", null, 2, 2, 2, 1, 2, true, "Młotowiertarka SDS Plus", 469m, 9m },
                    { 9, "NAR-WKR-12", "Wkrętaki płaskie i krzyżakowe do warsztatu", null, 2, 2, 2, 1, 2, true, "Zestaw wkrętaków 12 elementów", 69m, 35m },
                    { 10, "NAR-TAS-5M", "Miarka zwijana z blokadą do pomiarów budowlanych", null, 2, 2, 2, 1, 2, true, "Taśma miernicza 5 m", 24m, 60m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 10);
        }
    }
}
