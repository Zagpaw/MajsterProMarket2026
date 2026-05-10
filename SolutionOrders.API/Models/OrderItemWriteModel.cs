namespace SolutionOrders.API.Models
{
    public class OrderItemWriteModel
    {
        public int IdOrder { get; set; }
        public int IdItem { get; set; }
        public decimal? Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
