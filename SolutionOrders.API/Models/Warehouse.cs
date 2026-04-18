namespace SolutionOrders.API.Models
{
    public class Warehouse
    {
        public int IdWarehouse { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
