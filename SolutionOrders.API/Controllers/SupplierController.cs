using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Suppliers
                .AsNoTracking()
                .Where(supplier => supplier.IsActive)
                .OrderBy(supplier => supplier.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetById(int id, CancellationToken cancellationToken)
        {
            var supplier = await context.Suppliers
                .AsNoTracking()
                .FirstOrDefaultAsync(supplier => supplier.IdSupplier == id && supplier.IsActive, cancellationToken);

            return supplier is null ? NotFound() : Ok(supplier);
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> Create(Supplier supplier, CancellationToken cancellationToken)
        {
            supplier.IdSupplier = 0;
            supplier.IsActive = true;

            context.Suppliers.Add(supplier);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = supplier.IdSupplier }, supplier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Supplier supplier, CancellationToken cancellationToken)
        {
            if (id != supplier.IdSupplier)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingSupplier = await context.Suppliers.FindAsync([id], cancellationToken);
            if (existingSupplier is null || !existingSupplier.IsActive)
            {
                return NotFound();
            }

            existingSupplier.Name = supplier.Name;
            existingSupplier.ContactEmail = supplier.ContactEmail;
            existingSupplier.PhoneNumber = supplier.PhoneNumber;
            existingSupplier.IsActive = supplier.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var supplier = await context.Suppliers.FindAsync([id], cancellationToken);
            if (supplier is null || !supplier.IsActive)
            {
                return NotFound();
            }

            supplier.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
