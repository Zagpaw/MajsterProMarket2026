using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitOfMeasurementController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnitOfMeasurement>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.UnitOfMeasurements
                .AsNoTracking()
                .Where(unit => unit.IsActive)
                .OrderBy(unit => unit.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UnitOfMeasurement>> GetById(int id, CancellationToken cancellationToken)
        {
            var unit = await context.UnitOfMeasurements
                .AsNoTracking()
                .FirstOrDefaultAsync(unit => unit.IdUnitOfMeasurement == id && unit.IsActive, cancellationToken);

            return unit is null ? NotFound() : Ok(unit);
        }

        [HttpPost]
        public async Task<ActionResult<UnitOfMeasurement>> Create(UnitOfMeasurement unit, CancellationToken cancellationToken)
        {
            unit.IdUnitOfMeasurement = 0;
            unit.IsActive = true;

            context.UnitOfMeasurements.Add(unit);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = unit.IdUnitOfMeasurement }, unit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UnitOfMeasurement unit, CancellationToken cancellationToken)
        {
            if (id != unit.IdUnitOfMeasurement)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingUnit = await context.UnitOfMeasurements.FindAsync([id], cancellationToken);
            if (existingUnit is null || !existingUnit.IsActive)
            {
                return NotFound();
            }

            existingUnit.Name = unit.Name;
            existingUnit.Description = unit.Description;
            existingUnit.IsActive = unit.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var unit = await context.UnitOfMeasurements.FindAsync([id], cancellationToken);
            if (unit is null || !unit.IsActive)
            {
                return NotFound();
            }

            unit.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
