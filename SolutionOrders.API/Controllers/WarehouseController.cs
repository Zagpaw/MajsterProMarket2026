using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Warehouse>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Warehouses
                .AsNoTracking()
                .Where(warehouse => warehouse.IsActive)
                .OrderBy(warehouse => warehouse.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Warehouse>> GetById(int id, CancellationToken cancellationToken)
        {
            var warehouse = await context.Warehouses
                .AsNoTracking()
                .FirstOrDefaultAsync(warehouse => warehouse.IdWarehouse == id && warehouse.IsActive, cancellationToken);

            return warehouse is null ? NotFound() : Ok(warehouse);
        }

        [HttpPost]
        public async Task<ActionResult<Warehouse>> Create(Warehouse warehouse, CancellationToken cancellationToken)
        {
            warehouse.IdWarehouse = 0;
            warehouse.IsActive = true;

            context.Warehouses.Add(warehouse);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = warehouse.IdWarehouse }, warehouse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Warehouse warehouse, CancellationToken cancellationToken)
        {
            if (id != warehouse.IdWarehouse)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingWarehouse = await context.Warehouses.FindAsync([id], cancellationToken);
            if (existingWarehouse is null || !existingWarehouse.IsActive)
            {
                return NotFound();
            }

            existingWarehouse.Name = warehouse.Name;
            existingWarehouse.Location = warehouse.Location;
            existingWarehouse.IsActive = warehouse.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var warehouse = await context.Warehouses.FindAsync([id], cancellationToken);
            if (warehouse is null || !warehouse.IsActive)
            {
                return NotFound();
            }

            warehouse.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
