namespace SolutionOrders.API.Models
{
    public class Supplier
    {
        public int IdSupplier { get; set; }
        public string? Name { get; set; }
        public string? ContactEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
