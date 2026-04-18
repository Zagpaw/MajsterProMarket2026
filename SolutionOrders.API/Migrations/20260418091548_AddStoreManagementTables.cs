using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SolutionOrders.API.Migrations
{
    /// <inheritdoc />
    public partial class AddStoreManagementTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdBrand",
                table: "Items",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdSupplier",
                table: "Items",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdWarehouse",
                table: "Items",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    IdBrand = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.IdBrand);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    IdSupplier = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.IdSupplier);
                });

            migrationBuilder.CreateTable(
                name: "Warehouses",
                columns: table => new
                {
                    IdWarehouse = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.IdWarehouse);
                });

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "IdBrand", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "Materiały budowlane do prac remontowych", true, "MajsterMix" },
                    { 2, "Elektronarzędzia dla ekip wykonawczych", true, "ProWiert" }
                });

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 1,
                columns: new[] { "IdBrand", "IdSupplier", "IdWarehouse" },
                values: new object[] { 1, 1, 1 });

            migrationBuilder.UpdateData(
                table: "Items",
                keyColumn: "IdItem",
                keyValue: 2,
                columns: new[] { "IdBrand", "IdSupplier", "IdWarehouse" },
                values: new object[] { 2, 2, 2 });

            migrationBuilder.InsertData(
                table: "Suppliers",
                columns: new[] { "IdSupplier", "ContactEmail", "IsActive", "Name", "PhoneNumber" },
                values: new object[,]
                {
                    { 1, "zamowienia@budmat.example", true, "BudMat Hurt", "700-100-100" },
                    { 2, "kontakt@toolpartner.example", true, "ToolPartner", "700-200-200" }
                });

            migrationBuilder.InsertData(
                table: "Warehouses",
                columns: new[] { "IdWarehouse", "IsActive", "Location", "Name" },
                values: new object[,]
                {
                    { 1, true, "Warszawa - Białołęka", "Magazyn główny" },
                    { 2, true, "Kraków - Nowa Huta", "Magazyn narzędzi" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Items_IdBrand",
                table: "Items",
                column: "IdBrand");

            migrationBuilder.CreateIndex(
                name: "IX_Items_IdSupplier",
                table: "Items",
                column: "IdSupplier");

            migrationBuilder.CreateIndex(
                name: "IX_Items_IdWarehouse",
                table: "Items",
                column: "IdWarehouse");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Brands_IdBrand",
                table: "Items",
                column: "IdBrand",
                principalTable: "Brands",
                principalColumn: "IdBrand",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Suppliers_IdSupplier",
                table: "Items",
                column: "IdSupplier",
                principalTable: "Suppliers",
                principalColumn: "IdSupplier",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Warehouses_IdWarehouse",
                table: "Items",
                column: "IdWarehouse",
                principalTable: "Warehouses",
                principalColumn: "IdWarehouse",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Brands_IdBrand",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_Suppliers_IdSupplier",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_Warehouses_IdWarehouse",
                table: "Items");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "Warehouses");

            migrationBuilder.DropIndex(
                name: "IX_Items_IdBrand",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_IdSupplier",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_IdWarehouse",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IdBrand",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IdSupplier",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IdWarehouse",
                table: "Items");
        }
    }
}
