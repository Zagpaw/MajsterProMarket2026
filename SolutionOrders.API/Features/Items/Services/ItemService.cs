using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Features.Items.Services
{
    public class ItemService(ApplicationDbContext context) : IItemService
    {
        public async Task CreateItem(Item item, CancellationToken cancellationToken)
        {
            context.Items.Add(item);
            await context.SaveChangesAsync(cancellationToken);
        }

        public Task UpdateItem(Item item, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}