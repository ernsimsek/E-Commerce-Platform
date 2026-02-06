using System;
using System.Collections.Generic;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Events;
using ETicaretAPI.Domain.ValueObjects;

namespace ETicaretAPI.Domain.Entites
{
    public class Basket : BaseEntity
    {
        public Guid UserId { get; private set; }
        public string? PaymentIntentId { get; private set; }
        public string? ClientSecret { get; private set; }
        public Money TotalAmount { get; private set; }
        public Order? Order { get; private set; }
        public IReadOnlyCollection<BasketItem> Items => _items.AsReadOnly();
        private readonly List<BasketItem> _items = new();

        private Basket() { } // For EF Core

        public Basket(Guid userId)
        {
            UserId = userId;
            TotalAmount = new Money(0, "USD"); // Default currency
        }

        public void AddItem(Guid productId, int quantity, Money unitPrice)
        {
            var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.UpdateQuantity(existingItem.Quantity + quantity);
            }
            else
            {
                _items.Add(new BasketItem(Id, productId, quantity, unitPrice));
            }
            CalculateTotalAmount();
        }

        public void RemoveItem(Guid productId)
        {
            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                _items.Remove(item);
                CalculateTotalAmount();
            }
        }

        public void UpdateItemQuantity(Guid productId, int quantity)
        {
            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                item.UpdateQuantity(quantity);
                CalculateTotalAmount();
            }
        }

        public void SetPaymentIntent(string paymentIntentId, string clientSecret)
        {
            PaymentIntentId = paymentIntentId;
            ClientSecret = clientSecret;
        }

        private void CalculateTotalAmount()
        {
            if (_items.Count == 0)
            {
                TotalAmount = new Money(0, "USD");
                return;
            }

            var firstItem = _items.First();
            var total = _items.Aggregate(new Money(0, firstItem.UnitPrice.Currency),
                (sum, item) => sum + item.TotalPrice);
            
            TotalAmount = total;
        }
    }
}

