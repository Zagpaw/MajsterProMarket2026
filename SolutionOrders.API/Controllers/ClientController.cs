using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Clients
                .AsNoTracking()
                .Where(client => client.IsActive)
                .OrderBy(client => client.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetById(int id, CancellationToken cancellationToken)
        {
            var client = await context.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(client => client.IdClient == id && client.IsActive, cancellationToken);

            return client is null ? NotFound() : Ok(client);
        }

        [HttpPost]
        public async Task<ActionResult<Client>> Create(Client client, CancellationToken cancellationToken)
        {
            client.IdClient = 0;
            client.IsActive = true;

            context.Clients.Add(client);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = client.IdClient }, client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Client client, CancellationToken cancellationToken)
        {
            if (id != client.IdClient)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingClient = await context.Clients.FindAsync([id], cancellationToken);
            if (existingClient is null || !existingClient.IsActive)
            {
                return NotFound();
            }

            existingClient.Name = client.Name;
            existingClient.Address = client.Address;
            existingClient.PhoneNumber = client.PhoneNumber;
            existingClient.Password = client.Password;
            existingClient.IsActive = client.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var client = await context.Clients.FindAsync([id], cancellationToken);
            if (client is null || !client.IsActive)
            {
                return NotFound();
            }

            client.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
