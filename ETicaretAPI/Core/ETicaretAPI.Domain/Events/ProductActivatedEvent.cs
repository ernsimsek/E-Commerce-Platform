using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductActivatedEvent : DomainEvent
    {
        public Product Product { get; }

        public ProductActivatedEvent(Product product)
        {
            Product = product;
        }
    }
} 