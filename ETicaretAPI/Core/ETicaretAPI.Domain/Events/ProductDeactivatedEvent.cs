using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductDeactivatedEvent : DomainEvent
    {
        public Product Product { get; }

        public ProductDeactivatedEvent(Product product)
        {
            Product = product;
        }
    }
} 