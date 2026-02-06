using ETicaretAPI.Domain.Entites;
using Microsoft.Extensions.Logging;

namespace ETicaretAPI.Domain.Events
{
    public class BasketCreatedEventHandler : IDomainEventHandler<BasketCreatedEvent>
    {
        private readonly ILogger<BasketCreatedEventHandler> _logger;

        public BasketCreatedEventHandler(ILogger<BasketCreatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketCreatedEvent @event)
        {
            _logger.LogInformation("Basket created for user {UserId}", @event.Basket.UserId);
            return Task.CompletedTask;
        }
    }

    public class BasketItemAddedEventHandler : IDomainEventHandler<BasketItemAddedEvent>
    {
        private readonly ILogger<BasketItemAddedEventHandler> _logger;

        public BasketItemAddedEventHandler(ILogger<BasketItemAddedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketItemAddedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} added to basket {BasketId} with quantity {Quantity}",
                @event.Product.Id,
                @event.Basket.Id,
                @event.Quantity);
            return Task.CompletedTask;
        }
    }

    public class BasketItemRemovedEventHandler : IDomainEventHandler<BasketItemRemovedEvent>
    {
        private readonly ILogger<BasketItemRemovedEventHandler> _logger;

        public BasketItemRemovedEventHandler(ILogger<BasketItemRemovedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketItemRemovedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} removed from basket {BasketId}",
                @event.ProductId,
                @event.Basket.Id);
            return Task.CompletedTask;
        }
    }

    public class BasketItemUpdatedEventHandler : IDomainEventHandler<BasketItemUpdatedEvent>
    {
        private readonly ILogger<BasketItemUpdatedEventHandler> _logger;

        public BasketItemUpdatedEventHandler(ILogger<BasketItemUpdatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketItemUpdatedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} quantity updated to {Quantity} in basket {BasketId}",
                @event.ProductId,
                @event.NewQuantity,
                @event.Basket.Id);
            return Task.CompletedTask;
        }
    }

    public class BasketClearedEventHandler : IDomainEventHandler<BasketClearedEvent>
    {
        private readonly ILogger<BasketClearedEventHandler> _logger;

        public BasketClearedEventHandler(ILogger<BasketClearedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketClearedEvent @event)
        {
            _logger.LogInformation("Basket {BasketId} cleared", @event.Basket.Id);
            return Task.CompletedTask;
        }
    }

    public class BasketDeactivatedEventHandler : IDomainEventHandler<BasketDeactivatedEvent>
    {
        private readonly ILogger<BasketDeactivatedEventHandler> _logger;

        public BasketDeactivatedEventHandler(ILogger<BasketDeactivatedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(BasketDeactivatedEvent @event)
        {
            _logger.LogInformation("Basket {BasketId} deactivated", @event.Basket.Id);
            return Task.CompletedTask;
        }
    }
} 