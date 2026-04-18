using Mapster;
using SolutionOrders.API.Features.Items.Messages.Commands;
using SolutionOrders.API.Features.Items.Messages.DTOs;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Features.Items.Mappings
{
    public class ItemMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Item, ItemDto>()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.UnitName, src => src.UnitOfMeasurement != null ? src.UnitOfMeasurement.Name : null)
                .Map(dest => dest.SupplierName, src => src.Supplier != null ? src.Supplier.Name : null)
                .Map(dest => dest.BrandName, src => src.Brand != null ? src.Brand.Name : null)
                .Map(dest => dest.WarehouseName, src => src.Warehouse != null ? src.Warehouse.Name : null);

            config.NewConfig<CreateItemCommand, Item>()
                .Map(dest => dest.IsActive, _ => true)
                .Ignore(dest => dest.IdItem)
                .Ignore(dest => dest.Category)
                .Ignore(dest => dest.UnitOfMeasurement!)
                .Ignore(dest => dest.Supplier!)
                .Ignore(dest => dest.Brand!)
                .Ignore(dest => dest.Warehouse!)
                .Ignore(dest => dest.OrderItems);
            
            config.NewConfig<UpdateItemCommand, Item>()
                .Ignore(dest => dest.IdItem)
                .Ignore(dest => dest.Category)
                .Ignore(dest => dest.UnitOfMeasurement!)
                .Ignore(dest => dest.Supplier!)
                .Ignore(dest => dest.Brand!)
                .Ignore(dest => dest.Warehouse!)
                .Ignore(dest => dest.OrderItems);
        }
    }
}
