using System.Text.Json.Serialization;

namespace SolutionOrders.API.Models
{
    public class OrderItem
    {
        public int IdOrderItem { get; set; }
        public int IdOrder { get; set; }
        public int IdItem { get; set; }
        public decimal? Quantity { get; set; }
        public bool IsActive { get; set; }

        [JsonIgnore]
        public virtual Order? Order { get; set; }

        [JsonIgnore]
        public virtual Item? Item { get; set; }
    }
}
