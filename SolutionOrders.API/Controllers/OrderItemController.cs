using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.OrderItems
                .AsNoTracking()
                .Include(orderItem => orderItem.Item)
                .Where(orderItem => orderItem.IsActive)
                .OrderBy(orderItem => orderItem.IdOrder)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItem>> GetById(int id, CancellationToken cancellationToken)
        {
            var orderItem = await context.OrderItems
                .AsNoTracking()
                .Include(orderItem => orderItem.Item)
                .FirstOrDefaultAsync(orderItem => orderItem.IdOrderItem == id && orderItem.IsActive, cancellationToken);

            return orderItem is null ? NotFound() : Ok(orderItem);
        }

        [HttpPost]
        public async Task<ActionResult<OrderItem>> Create(OrderItem orderItem, CancellationToken cancellationToken)
        {
            orderItem.IdOrderItem = 0;
            orderItem.IsActive = true;

            context.OrderItems.Add(orderItem);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = orderItem.IdOrderItem }, orderItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrderItem orderItem, CancellationToken cancellationToken)
        {
            if (id != orderItem.IdOrderItem)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingOrderItem = await context.OrderItems.FindAsync([id], cancellationToken);
            if (existingOrderItem is null || !existingOrderItem.IsActive)
            {
                return NotFound();
            }

            existingOrderItem.IdOrder = orderItem.IdOrder;
            existingOrderItem.IdItem = orderItem.IdItem;
            existingOrderItem.Quantity = orderItem.Quantity;
            existingOrderItem.IsActive = orderItem.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var orderItem = await context.OrderItems.FindAsync([id], cancellationToken);
            if (orderItem is null || !orderItem.IsActive)
            {
                return NotFound();
            }

            orderItem.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
