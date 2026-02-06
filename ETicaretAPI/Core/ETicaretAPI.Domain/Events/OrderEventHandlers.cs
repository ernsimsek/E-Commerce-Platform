using ETicaretAPI.Domain.Entites;
using Microsoft.Extensions.Logging;

namespace ETicaretAPI.Domain.Events
{
    public class OrderCreatedEventHandler : IDomainEventHandler<OrderCreatedEvent>
    {
        private readonly ILogger<OrderCreatedEventHandler> _logger;

        public OrderCreatedEventHandler(ILogger<OrderCreatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderCreatedEvent @event)
        {
            _logger.LogInformation(
                "Order {OrderNumber} created for user {UserId}",
                @event.Order.OrderNumber,
                @event.Order.UserId);
            return Task.CompletedTask;
        }
    }

    public class OrderItemAddedEventHandler : IDomainEventHandler<OrderItemAddedEvent>
    {
        private readonly ILogger<OrderItemAddedEventHandler> _logger;

        public OrderItemAddedEventHandler(ILogger<OrderItemAddedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderItemAddedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} added to order {OrderNumber} with quantity {Quantity}",
                @event.Product.Id,
                @event.Order.OrderNumber,
                @event.Quantity);
            return Task.CompletedTask;
        }
    }

    public class OrderStatusChangedEventHandler : IDomainEventHandler<OrderStatusChangedEvent>
    {
        private readonly ILogger<OrderStatusChangedEventHandler> _logger;

        public OrderStatusChangedEventHandler(ILogger<OrderStatusChangedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderStatusChangedEvent @event)
        {
            _logger.LogInformation(
                "Order {OrderNumber} status changed to {NewStatus}",
                @event.Order.OrderNumber,
                @event.NewStatus);
            return Task.CompletedTask;
        }
    }

    public class OrderPaymentProcessedEventHandler : IDomainEventHandler<OrderPaymentProcessedEvent>
    {
        private readonly ILogger<OrderPaymentProcessedEventHandler> _logger;

        public OrderPaymentProcessedEventHandler(ILogger<OrderPaymentProcessedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderPaymentProcessedEvent @event)
        {
            _logger.LogInformation(
                "Payment processed for order {OrderNumber}",
                @event.Order.OrderNumber);
            return Task.CompletedTask;
        }
    }

    public class OrderShippedEventHandler : IDomainEventHandler<OrderShippedEvent>
    {
        private readonly ILogger<OrderShippedEventHandler> _logger;

        public OrderShippedEventHandler(ILogger<OrderShippedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderShippedEvent @event)
        {
            _logger.LogInformation(
                "Order {OrderNumber} has been shipped",
                @event.Order.OrderNumber);
            return Task.CompletedTask;
        }
    }

    public class OrderDeliveredEventHandler : IDomainEventHandler<OrderDeliveredEvent>
    {
        private readonly ILogger<OrderDeliveredEventHandler> _logger;

        public OrderDeliveredEventHandler(ILogger<OrderDeliveredEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderDeliveredEvent @event)
        {
            _logger.LogInformation(
                "Order {OrderNumber} has been delivered",
                @event.Order.OrderNumber);
            return Task.CompletedTask;
        }
    }

    public class OrderCancelledEventHandler : IDomainEventHandler<OrderCancelledEvent>
    {
        private readonly ILogger<OrderCancelledEventHandler> _logger;

        public OrderCancelledEventHandler(ILogger<OrderCancelledEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(OrderCancelledEvent @event)
        {
            _logger.LogInformation(
                "Order {OrderNumber} has been cancelled",
                @event.Order.OrderNumber);
            return Task.CompletedTask;
        }
    }
} 