using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkerController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Workers
                .AsNoTracking()
                .Where(worker => worker.IsActive)
                .OrderBy(worker => worker.LastName)
                .ThenBy(worker => worker.FirstName)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetById(int id, CancellationToken cancellationToken)
        {
            var worker = await context.Workers
                .AsNoTracking()
                .FirstOrDefaultAsync(worker => worker.IdWorker == id && worker.IsActive, cancellationToken);

            return worker is null ? NotFound() : Ok(worker);
        }

        [HttpPost]
        public async Task<ActionResult<Worker>> Create(Worker worker, CancellationToken cancellationToken)
        {
            worker.IdWorker = 0;
            worker.IsActive = true;

            context.Workers.Add(worker);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = worker.IdWorker }, worker);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Worker worker, CancellationToken cancellationToken)
        {
            if (id != worker.IdWorker)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingWorker = await context.Workers.FindAsync([id], cancellationToken);
            if (existingWorker is null || !existingWorker.IsActive)
            {
                return NotFound();
            }

            existingWorker.FirstName = worker.FirstName;
            existingWorker.LastName = worker.LastName;
            existingWorker.Login = worker.Login;
            existingWorker.IsActive = worker.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var worker = await context.Workers.FindAsync([id], cancellationToken);
            if (worker is null || !worker.IsActive)
            {
                return NotFound();
            }

            worker.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
