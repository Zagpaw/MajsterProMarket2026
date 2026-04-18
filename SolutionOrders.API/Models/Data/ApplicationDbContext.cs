using Microsoft.EntityFrameworkCore;

namespace SolutionOrders.API.Models.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
          : base(options)
        {
        }

        public DbSet<UnitOfMeasurement> UnitOfMeasurements { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UnitOfMeasurement>(entity =>
            {
                entity.HasKey(e => e.IdUnitOfMeasurement);
                entity.Property(e => e.IsActive).IsRequired();
            });

            // Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.IdCategory);
                entity.Property(e => e.IsActive).IsRequired();
            });

            // Client
            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(e => e.IdClient);
                entity.Property(e => e.IsActive).IsRequired();
            });

            // Worker
            modelBuilder.Entity<Worker>(entity =>
            {
                entity.HasKey(e => e.IdWorker);
                entity.Property(e => e.Login).IsRequired();
                entity.Property(e => e.IsActive).IsRequired();
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasKey(e => e.IdSupplier);
                entity.Property(e => e.IsActive).IsRequired();
            });

            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.IdBrand);
                entity.Property(e => e.IsActive).IsRequired();
            });

            modelBuilder.Entity<Warehouse>(entity =>
            {
                entity.HasKey(e => e.IdWarehouse);
                entity.Property(e => e.IsActive).IsRequired();
            });

            // Item
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.IdItem);
                entity.Property(e => e.IdCategory).IsRequired();
                entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 0)");
                entity.Property(e => e.IsActive).IsRequired();

                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Items)
                    .HasForeignKey(e => e.IdCategory)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UnitOfMeasurement)
                    .WithMany(u => u.Items)
                    .HasForeignKey(e => e.IdUnitOfMeasurement)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Supplier)
                    .WithMany(s => s.Items)
                    .HasForeignKey(e => e.IdSupplier)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Brand)
                    .WithMany(b => b.Items)
                    .HasForeignKey(e => e.IdBrand)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Warehouse)
                    .WithMany(w => w.Items)
                    .HasForeignKey(e => e.IdWarehouse)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.IdOrder);

                entity.HasOne(e => e.Client)
                    .WithMany(c => c.Orders)
                    .HasForeignKey(e => e.IdClient)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Worker)
                    .WithMany(w => w.Orders)
                    .HasForeignKey(e => e.IdWorker)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderItem
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.IdOrderItem);
                entity.Property(e => e.IdOrder).IsRequired();
                entity.Property(e => e.IdItem).IsRequired();
                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 0)");
                entity.Property(e => e.IsActive).IsRequired();

                entity.HasOne(e => e.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(e => e.IdOrder)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Item)
                    .WithMany(i => i.OrderItems)
                    .HasForeignKey(e => e.IdItem)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed data - przykładowe dane
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // UnitOfMeasurement
            modelBuilder.Entity<UnitOfMeasurement>().HasData(
                new UnitOfMeasurement { IdUnitOfMeasurement = 1, Name = "szt", Description = "Sztuki", IsActive = true },
                new UnitOfMeasurement { IdUnitOfMeasurement = 2, Name = "kg", Description = "Kilogramy", IsActive = true },
                new UnitOfMeasurement { IdUnitOfMeasurement = 3, Name = "l", Description = "Litry", IsActive = true }
            );

            // Category
            modelBuilder.Entity<Category>().HasData(
                new Category { IdCategory = 1, Name = "Materiały budowlane", Description = "Cement, zaprawy i elementy konstrukcyjne", IsActive = true },
                new Category { IdCategory = 2, Name = "Narzędzia i warsztat", Description = "Narzędzia ręczne, elektronarzędzia i akcesoria", IsActive = true }
            );

            // Client
            modelBuilder.Entity<Client>().HasData(
                new Client { IdClient = 1, Name = "Ekipa Remontowa Alfa", Address = "ul. Murarska 12, Warszawa", PhoneNumber = "500-100-200", IsActive = true },
                new Client { IdClient = 2, Name = "Dom i Ogród Nowak", Address = "ul. Ogrodowa 5, Kraków", PhoneNumber = "600-200-300", IsActive = true }
            );

            // Worker
            modelBuilder.Entity<Worker>().HasData(
                new Worker { IdWorker = 1, FirstName = "Tomasz", LastName = "Maj", Login = "tmaj", IsActive = true },
                new Worker { IdWorker = 2, FirstName = "Karolina", LastName = "Bruk", Login = "kbruk", IsActive = true }
            );

            modelBuilder.Entity<Supplier>().HasData(
                new Supplier { IdSupplier = 1, Name = "BudMat Hurt", ContactEmail = "zamowienia@budmat.example", PhoneNumber = "700-100-100", IsActive = true },
                new Supplier { IdSupplier = 2, Name = "ToolPartner", ContactEmail = "kontakt@toolpartner.example", PhoneNumber = "700-200-200", IsActive = true }
            );

            modelBuilder.Entity<Brand>().HasData(
                new Brand { IdBrand = 1, Name = "MajsterMix", Description = "Materiały budowlane do prac remontowych", IsActive = true },
                new Brand { IdBrand = 2, Name = "ProWiert", Description = "Elektronarzędzia dla ekip wykonawczych", IsActive = true }
            );

            modelBuilder.Entity<Warehouse>().HasData(
                new Warehouse { IdWarehouse = 1, Name = "Magazyn główny", Location = "Warszawa - Białołęka", IsActive = true },
                new Warehouse { IdWarehouse = 2, Name = "Magazyn narzędzi", Location = "Kraków - Nowa Huta", IsActive = true }
            );

            // Item
            modelBuilder.Entity<Item>().HasData(
                new Item { IdItem = 1, Name = "Cement uniwersalny 25 kg", Description = "Cement do prac murarskich i remontowych", IdCategory = 1, Price = 29, Quantity = 120, IdUnitOfMeasurement = 2, IdSupplier = 1, IdBrand = 1, IdWarehouse = 1, Code = "BUD-CEM-25", IsActive = true },
                new Item { IdItem = 2, Name = "Wiertarka udarowa 850 W", Description = "Wiertarka do betonu, cegły i drewna", IdCategory = 2, Price = 249, Quantity = 18, IdUnitOfMeasurement = 1, IdSupplier = 2, IdBrand = 2, IdWarehouse = 2, Code = "NAR-WIE-850", IsActive = true }
            );
        }
    }
}
