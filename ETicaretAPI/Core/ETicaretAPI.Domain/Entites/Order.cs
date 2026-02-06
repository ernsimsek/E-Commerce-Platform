using System;
using System.Collections.Generic;
using System.Linq;
using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.Events;
using ETicaretAPI.Domain.ValueObjects;
using ETicaretAPI.Domain.Enums;

namespace ETicaretAPI.Domain.Entites
{
    public class Order : BaseEntity
    {
        public string UserId { get; private set; }
        public string OrderNumber { get; private set; }
        public Money TotalAmount { get; private set; }
        public OrderStatus Status { get; private set; }
        public Address ShippingAddress { get; private set; }
        public Address BillingAddress { get; private set; }
        public PaymentMethod PaymentMethod { get; private set; }
        public Basket Basket { get; private set; }
        public ICollection<OrderItem> Items { get; private set; } = new List<OrderItem>();

        private Order() { } // For EF Core

        public Order(string userId, Address shippingAddress, Address billingAddress, PaymentMethod paymentMethod)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new DomainException("User ID cannot be empty");

            UserId = userId;
            OrderNumber = GenerateOrderNumber();
            Status = OrderStatus.Created;
            ShippingAddress = shippingAddress;
            BillingAddress = billingAddress;
            PaymentMethod = paymentMethod;
            Items = new List<OrderItem>();
            TotalAmount = new Money(0, "USD");

            AddDomainEvent(new OrderCreatedEvent(this));
        }

        public void AddItem(Product product, int quantity)
        {
            if (product == null)
                throw new DomainException("Product cannot be null");

            if (quantity <= 0)
                throw new DomainException("Quantity must be greater than zero");

            var orderItem = new OrderItem(product, quantity);
            Items.Add(orderItem);
            RecalculateTotal();
            AddDomainEvent(new OrderItemAddedEvent(this, product, quantity));
        }

        public void UpdateStatus(OrderStatus newStatus)
        {
            if (Status == newStatus)
                return;

            Status = newStatus;
            AddDomainEvent(new OrderStatusChangedEvent(this, newStatus));
        }

        public void ProcessPayment()
        {
            if (Status != OrderStatus.Created)
                throw new DomainException("Order is not in created status");

            // Payment processing logic would go here
            UpdateStatus(OrderStatus.PaymentProcessed);
            AddDomainEvent(new OrderPaymentProcessedEvent(this));
        }

        public void Ship()
        {
            if (Status != OrderStatus.PaymentProcessed)
                throw new DomainException("Order payment has not been processed");

            UpdateStatus(OrderStatus.Shipped);
            AddDomainEvent(new OrderShippedEvent(this));
        }

        public void Deliver()
        {
            if (Status != OrderStatus.Shipped)
                throw new DomainException("Order has not been shipped");

            UpdateStatus(OrderStatus.Delivered);
            AddDomainEvent(new OrderDeliveredEvent(this));
        }

        public void Cancel()
        {
            if (Status == OrderStatus.Delivered || Status == OrderStatus.Cancelled)
                throw new DomainException("Order cannot be cancelled");

            UpdateStatus(OrderStatus.Cancelled);
            AddDomainEvent(new OrderCancelledEvent(this));
        }

        private void RecalculateTotal()
        {
            var total = Items.Sum(item => item.TotalPrice.Amount);
            TotalAmount = new Money(total, "USD");
        }

        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        }
    }
}
