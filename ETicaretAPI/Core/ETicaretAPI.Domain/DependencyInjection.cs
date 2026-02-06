using ETicaretAPI.Domain.Events;
using Microsoft.Extensions.DependencyInjection;

namespace ETicaretAPI.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDomain(this IServiceCollection services)
        {
            services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();

            // Register all domain event handlers
            services.AddScoped<IDomainEventHandler<BasketCreatedEvent>, BasketCreatedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemAddedEvent>, BasketItemAddedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemRemovedEvent>, BasketItemRemovedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemUpdatedEvent>, BasketItemUpdatedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketClearedEvent>, BasketClearedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketDeactivatedEvent>, BasketDeactivatedEventHandler>();

            services.AddScoped<IDomainEventHandler<OrderCreatedEvent>, OrderCreatedEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderItemAddedEvent>, OrderItemAddedEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderStatusChangedEvent>, OrderStatusChangedEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderPaymentProcessedEvent>, OrderPaymentProcessedEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderShippedEvent>, OrderShippedEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderDeliveredEvent>, OrderDeliveredEventHandler>();
            services.AddScoped<IDomainEventHandler<OrderCancelledEvent>, OrderCancelledEventHandler>();

            // Product stock event handlers
            services.AddScoped<IDomainEventHandler<ProductStockIncreasedEvent>, ProductStockIncreasedEventHandler>();
            services.AddScoped<IDomainEventHandler<ProductStockDecreasedEvent>, ProductStockDecreasedEventHandler>();

            return services;
        }
    }
} 