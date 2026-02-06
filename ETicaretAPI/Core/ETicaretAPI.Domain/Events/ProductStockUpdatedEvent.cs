using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductStockUpdatedEvent : DomainEvent
    {
        public Product Product { get; }

        public ProductStockUpdatedEvent(Product product)
        {
            Product = product;
        }
    }
} 