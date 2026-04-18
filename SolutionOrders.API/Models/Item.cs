namespace SolutionOrders.API.Models
{
    public class Item
    {
        public int IdItem { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int IdCategory { get; set; }
        public decimal? Price { get; set; }
        public decimal? Quantity { get; set; }
        public string? FotoUrl { get; set; }
        public int? IdUnitOfMeasurement { get; set; }
        public int? IdSupplier { get; set; }
        public int? IdBrand { get; set; }
        public int? IdWarehouse { get; set; }
        public string? Code { get; set; }
        public bool IsActive { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual UnitOfMeasurement? UnitOfMeasurement { get; set; }
        public virtual Supplier? Supplier { get; set; }
        public virtual Brand? Brand { get; set; }
        public virtual Warehouse? Warehouse { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
