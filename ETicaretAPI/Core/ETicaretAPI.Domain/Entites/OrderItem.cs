using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.ValueObjects;

namespace ETicaretAPI.Domain.Entites
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; private set; }
        public Order Order { get; private set; }
        public Guid ProductId { get; private set; }
        public Product Product { get; private set; }
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; }
        public Money TotalPrice { get; private set; }

        private OrderItem() { } // For EF Core

        public OrderItem(Product product, int quantity)
        {
            if (product == null)
                throw new DomainException("Product cannot be null");

            if (quantity <= 0)
                throw new DomainException("Quantity must be greater than zero");

            ProductId = product.Id;
            Product = product;
            Quantity = quantity;
            UnitPrice = product.Price;
            TotalPrice = new Money(UnitPrice.Amount * Quantity, UnitPrice.Currency);
        }

        public void UpdateQuantity(int newQuantity)
        {
            if (newQuantity <= 0)
                throw new DomainException("Quantity must be greater than zero");

            Quantity = newQuantity;
            TotalPrice = new Money(UnitPrice.Amount * Quantity, UnitPrice.Currency);
        }
    }
} 