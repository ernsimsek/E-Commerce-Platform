using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductStockDecreasedEvent : DomainEvent
    {
        public Product Product { get; }
        public int Quantity { get; }

        public ProductStockDecreasedEvent(Product product, int quantity)
        {
            Product = product;
            Quantity = quantity;
        }
    }
} 