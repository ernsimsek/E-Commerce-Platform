using System;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Events;
using ETicaretAPI.Domain.ValueObjects;

namespace ETicaretAPI.Domain.Entites
{
    public class BasketItem : BaseEntity
    {
        public Guid BasketId { get; private set; }
        public Guid ProductId { get; private set; }
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; } = null!;
        public Money TotalPrice { get; private set; } = null!;

        public Basket? Basket { get; private set; }
        public Product? Product { get; private set; }

        private BasketItem() { } // For EF Core

        public BasketItem(Guid basketId, Guid productId, int quantity, Money unitPrice)
        {
            if (quantity <= 0)
                throw new DomainException("Quantity must be greater than zero");

            if (unitPrice == null)
                throw new DomainException("Unit price cannot be null");

            BasketId = basketId;
            ProductId = productId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            TotalPrice = CalculateTotalPrice(unitPrice, quantity);
        }

        public void UpdateQuantity(int newQuantity)
        {
            if (newQuantity <= 0)
                throw new DomainException("Quantity must be greater than zero");

            Quantity = newQuantity;
            TotalPrice = CalculateTotalPrice(UnitPrice, newQuantity);
        }

        public void UpdateUnitPrice(Money newUnitPrice)
        {
            if (newUnitPrice == null)
                throw new DomainException("Unit price cannot be null");

            UnitPrice = newUnitPrice;
            TotalPrice = CalculateTotalPrice(newUnitPrice, Quantity);
        }

        private Money CalculateTotalPrice(Money unitPrice, int quantity)
        {
            return unitPrice * quantity;
        }
    }
}
