using ETicaretAPI.Domain.Entites;
using ETicaretAPI.Domain.Enums;

namespace ETicaretAPI.Domain.Events
{
    public class OrderCreatedEvent : DomainEvent
    {
        public Order Order { get; }

        public OrderCreatedEvent(Order order)
        {
            Order = order;
        }
    }

    public class OrderItemAddedEvent : DomainEvent
    {
        public Order Order { get; }
        public Product Product { get; }
        public int Quantity { get; }

        public OrderItemAddedEvent(Order order, Product product, int quantity)
        {
            Order = order;
            Product = product;
            Quantity = quantity;
        }
    }

    public class OrderStatusChangedEvent : DomainEvent
    {
        public Order Order { get; }
        public OrderStatus NewStatus { get; }

        public OrderStatusChangedEvent(Order order, OrderStatus newStatus)
        {
            Order = order;
            NewStatus = newStatus;
        }
    }

    public class OrderPaymentProcessedEvent : DomainEvent
    {
        public Order Order { get; }

        public OrderPaymentProcessedEvent(Order order)
        {
            Order = order;
        }
    }

    public class OrderShippedEvent : DomainEvent
    {
        public Order Order { get; }

        public OrderShippedEvent(Order order)
        {
            Order = order;
        }
    }

    public class OrderDeliveredEvent : DomainEvent
    {
        public Order Order { get; }

        public OrderDeliveredEvent(Order order)
        {
            Order = order;
        }
    }

    public class OrderCancelledEvent : DomainEvent
    {
        public Order Order { get; }

        public OrderCancelledEvent(Order order)
        {
            Order = order;
        }
    }
} 