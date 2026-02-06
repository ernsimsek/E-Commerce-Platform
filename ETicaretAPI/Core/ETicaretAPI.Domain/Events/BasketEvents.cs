using ETicaretAPI.Domain.Entites;
using System;

namespace ETicaretAPI.Domain.Events
{
    public class BasketCreatedEvent : DomainEvent
    {
        public Basket Basket { get; }

        public BasketCreatedEvent(Basket basket)
        {
            Basket = basket;
        }
    }

    public class BasketItemAddedEvent : DomainEvent
    {
        public Basket Basket { get; }
        public Product Product { get; }
        public int Quantity { get; }

        public BasketItemAddedEvent(Basket basket, Product product, int quantity)
        {
            Basket = basket;
            Product = product;
            Quantity = quantity;
        }
    }

    public class BasketItemRemovedEvent : DomainEvent
    {
        public Basket Basket { get; }
        public Guid ProductId { get; }

        public BasketItemRemovedEvent(Basket basket, Guid productId)
        {
            Basket = basket;
            ProductId = productId;
        }
    }

    public class BasketItemUpdatedEvent : DomainEvent
    {
        public Basket Basket { get; }
        public Guid ProductId { get; }
        public int NewQuantity { get; }

        public BasketItemUpdatedEvent(Basket basket, Guid productId, int newQuantity)
        {
            Basket = basket;
            ProductId = productId;
            NewQuantity = newQuantity;
        }
    }

    public class BasketClearedEvent : DomainEvent
    {
        public Basket Basket { get; }

        public BasketClearedEvent(Basket basket)
        {
            Basket = basket;
        }
    }

    public class BasketDeactivatedEvent : DomainEvent
    {
        public Basket Basket { get; }

        public BasketDeactivatedEvent(Basket basket)
        {
            Basket = basket;
        }
    }
} 