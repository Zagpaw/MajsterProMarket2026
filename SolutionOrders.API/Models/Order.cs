namespace SolutionOrders.API.Models
{
    public class Order
    {
        public int IdOrder { get; set; }
        public DateTime? DataOrder { get; set; }
        public int? IdClient { get; set; }
        public int? IdWorker { get; set; }
        public string? Notes { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentStatus { get; set; }
        public decimal? TotalAmount { get; set; }

        // Navigation properties
        public virtual Client? Client { get; set; }
        public virtual Worker? Worker { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
