using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductUpdatedEvent : DomainEvent
    {
        public Product Product { get; }

        public ProductUpdatedEvent(Product product)
        {
            Product = product;
        }
    }
} 