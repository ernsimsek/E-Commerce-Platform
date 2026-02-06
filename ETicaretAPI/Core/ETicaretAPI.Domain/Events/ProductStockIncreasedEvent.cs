using System;
using ETicaretAPI.Domain.Entites;

namespace ETicaretAPI.Domain.Events
{
    public class ProductStockIncreasedEvent : DomainEvent
    {
        public Product Product { get; }
        public int Quantity { get; }

        public ProductStockIncreasedEvent(Product product, int quantity)
        {
            Product = product;
            Quantity = quantity;
        }
    }
} 