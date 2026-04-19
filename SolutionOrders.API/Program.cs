using Mapster;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Features.Items.Providers;
using SolutionOrders.API.Features.Items.Services;
using SolutionOrders.API.Models.Data;
using System.Reflection;
using System.Text.Json.Serialization;

namespace SolutionOrders.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            RegisterDbContextAndMediatr(builder);
            RegisterMappers();
            RegisterServices(builder);
            RegisterProviders(builder);
            RegisterControllersAndOpenApi(builder);
            SetUpCorsPolicy(builder);
            var app = builder.Build();
            ConfigureDevelopment(app);
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }

        private static void RegisterControllersAndOpenApi(WebApplicationBuilder builder)
        {
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
        }

        private static void RegisterDbContextAndMediatr(WebApplicationBuilder builder)
        {
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        }

        private static void RegisterMappers()
        {
            TypeAdapterConfig.GlobalSettings.Scan(Assembly.GetExecutingAssembly());
        }

        private static void RegisterServices(WebApplicationBuilder builder)
        {
            builder.Services.AddTransient<IItemService, ItemService>();
        }

        private static void RegisterProviders(WebApplicationBuilder builder)
        {
            builder.Services.AddTransient<IItemProvider, ItemProvider>();
        }

        private static void SetUpCorsPolicy(WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
        }

        private static void ConfigureDevelopment(WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                using var scope = app.Services.CreateScope();
                try
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    dbContext.Database.Migrate();
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Błąd podczas migracji bazy danych");
                    throw;
                }
            }

            app.UseCors("AllowAll");
            app.MapOpenApi();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/openapi/v1.json", "v1");
            });
        }
    }
}
