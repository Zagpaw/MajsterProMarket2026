using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Orders
                .AsNoTracking()
                .Include(order => order.Client)
                .Include(order => order.Worker)
                .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Item)
                .OrderByDescending(order => order.DataOrder)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(int id, CancellationToken cancellationToken)
        {
            var order = await context.Orders
                .AsNoTracking()
                .Include(order => order.Client)
                .Include(order => order.Worker)
                .Include(order => order.OrderItems)
                .ThenInclude(orderItem => orderItem.Item)
                .FirstOrDefaultAsync(order => order.IdOrder == id, cancellationToken);

            return order is null ? NotFound() : Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create(Order order, CancellationToken cancellationToken)
        {
            order.IdOrder = 0;
            order.DataOrder ??= DateTime.UtcNow;

            context.Orders.Add(order);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = order.IdOrder }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order order, CancellationToken cancellationToken)
        {
            if (id != order.IdOrder)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingOrder = await context.Orders.FindAsync([id], cancellationToken);
            if (existingOrder is null)
            {
                return NotFound();
            }

            existingOrder.DataOrder = order.DataOrder;
            existingOrder.IdClient = order.IdClient;
            existingOrder.IdWorker = order.IdWorker;
            existingOrder.Notes = order.Notes;
            existingOrder.DeliveryDate = order.DeliveryDate;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var order = await context.Orders.FindAsync([id], cancellationToken);
            if (order is null)
            {
                return NotFound();
            }

            context.Orders.Remove(order);
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
