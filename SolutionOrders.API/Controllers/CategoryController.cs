using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Categories
                .AsNoTracking()
                .Where(category => category.IsActive)
                .OrderBy(category => category.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetById(int id, CancellationToken cancellationToken)
        {
            var category = await context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(category => category.IdCategory == id && category.IsActive, cancellationToken);

            return category is null ? NotFound() : Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<Category>> Create(Category category, CancellationToken cancellationToken)
        {
            category.IdCategory = 0;
            category.IsActive = true;

            context.Categories.Add(category);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = category.IdCategory }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Category category, CancellationToken cancellationToken)
        {
            if (id != category.IdCategory)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingCategory = await context.Categories.FindAsync([id], cancellationToken);
            if (existingCategory is null || !existingCategory.IsActive)
            {
                return NotFound();
            }

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.IsActive = category.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var category = await context.Categories.FindAsync([id], cancellationToken);
            if (category is null || !category.IsActive)
            {
                return NotFound();
            }

            category.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
