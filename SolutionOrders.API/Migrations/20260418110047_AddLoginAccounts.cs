using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SolutionOrders.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginAccounts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Workers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "IdClient",
                keyValue: 1,
                column: "Password",
                value: "klient.123");

            migrationBuilder.UpdateData(
                table: "Clients",
                keyColumn: "IdClient",
                keyValue: 2,
                column: "Password",
                value: "dom.123");

            migrationBuilder.UpdateData(
                table: "Workers",
                keyColumn: "IdWorker",
                keyValue: 1,
                columns: new[] { "FirstName", "LastName", "Login", "Password" },
                values: new object[] { "Paweł", "Administrator", "pawel", "haslo.123" });

            migrationBuilder.UpdateData(
                table: "Workers",
                keyColumn: "IdWorker",
                keyValue: 2,
                column: "Password",
                value: "pracownik.123");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Workers");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Clients");

            migrationBuilder.UpdateData(
                table: "Workers",
                keyColumn: "IdWorker",
                keyValue: 1,
                columns: new[] { "FirstName", "LastName", "Login" },
                values: new object[] { "Tomasz", "Maj", "tmaj" });
        }
    }
}
