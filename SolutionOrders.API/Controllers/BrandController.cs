using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Models;
using SolutionOrders.API.Models.Data;

namespace SolutionOrders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetAll(CancellationToken cancellationToken)
        {
            return Ok(await context.Brands
                .AsNoTracking()
                .Where(brand => brand.IsActive)
                .OrderBy(brand => brand.Name)
                .ToListAsync(cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetById(int id, CancellationToken cancellationToken)
        {
            var brand = await context.Brands
                .AsNoTracking()
                .FirstOrDefaultAsync(brand => brand.IdBrand == id && brand.IsActive, cancellationToken);

            return brand is null ? NotFound() : Ok(brand);
        }

        [HttpPost]
        public async Task<ActionResult<Brand>> Create(Brand brand, CancellationToken cancellationToken)
        {
            brand.IdBrand = 0;
            brand.IsActive = true;

            context.Brands.Add(brand);
            await context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = brand.IdBrand }, brand);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Brand brand, CancellationToken cancellationToken)
        {
            if (id != brand.IdBrand)
            {
                return BadRequest(new { message = "ID w URL różni się od ID w body" });
            }

            var existingBrand = await context.Brands.FindAsync([id], cancellationToken);
            if (existingBrand is null || !existingBrand.IsActive)
            {
                return NotFound();
            }

            existingBrand.Name = brand.Name;
            existingBrand.Description = brand.Description;
            existingBrand.IsActive = brand.IsActive;

            await context.SaveChangesAsync(cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var brand = await context.Brands.FindAsync([id], cancellationToken);
            if (brand is null || !brand.IsActive)
            {
                return NotFound();
            }

            brand.IsActive = false;
            await context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
    }
}
