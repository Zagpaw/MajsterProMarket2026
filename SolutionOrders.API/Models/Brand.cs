namespace SolutionOrders.API.Models
{
    public class Brand
    {
        public int IdBrand { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
