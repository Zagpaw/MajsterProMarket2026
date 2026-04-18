namespace SolutionOrders.API.Features.Items.Messages.DTOs
{
    public class ItemDto
    {
        public int IdItem { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int IdCategory { get; set; }
        public string? CategoryName { get; set; }
        public decimal? Price { get; set; }
        public decimal? Quantity { get; set; }
        public int? IdUnitOfMeasurement { get; set; }
        public string? UnitName { get; set; }
        public int? IdSupplier { get; set; }
        public string? SupplierName { get; set; }
        public int? IdBrand { get; set; }
        public string? BrandName { get; set; }
        public int? IdWarehouse { get; set; }
        public string? WarehouseName { get; set; }
        public string? Code { get; set; }
        public bool IsActive { get; set; }
    }
}
