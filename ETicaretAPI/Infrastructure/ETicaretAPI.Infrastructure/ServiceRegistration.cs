using ETicaretAPI.Application.Abstractions.Storage;
using ETicaretAPI.Application.Abstractions.Token;
using ETicaretAPI.Domain.Events;
using ETicaretAPI.Infrastructure.Enums;
using ETicaretAPI.Infrastructure.Services.Storage;
//using ETicaretAPI.Infrastructure.Services.Storage.Azure;
using ETicaretAPI.Infrastructure.Services.Storage.Local;
using ETicaretAPI.Infrastructure.Services.Token;
using Microsoft.Extensions.DependencyInjection;

namespace ETicaretAPI.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructureServices(this IServiceCollection services)
        {
            // Register domain event dispatcher
            services.AddScoped<IDomainEventDispatcher, ETicaretAPI.Infrastructure.DomainEvents.DomainEventDispatcher>();

            // Remove direct UnitOfWork registration since it requires DbContext
            // UnitOfWork should be registered in the Persistence layer instead
            // services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register event handlers
            // RegisterEventHandlers(services);

            services.AddScoped<IStorage, LocalStorage>();
            services.AddScoped<IStorageService, StorageService>();
            services.AddScoped<ITokenHandler, TokenHandler>();
        }

        /*
        private static void RegisterEventHandlers(IServiceCollection services)
        {
            // Product event handlers
            // Example: services.AddScoped<IDomainEventHandler<ProductCreatedEvent>, ProductCreatedEventHandler>();

            // Basket event handlers
            services.AddScoped<IDomainEventHandler<BasketCreatedEvent>, BasketCreatedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemAddedEvent>, BasketItemAddedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemRemovedEvent>, BasketItemRemovedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketItemUpdatedEvent>, BasketItemUpdatedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketClearedEvent>, BasketClearedEventHandler>();
            services.AddScoped<IDomainEventHandler<BasketDeactivatedEvent>, BasketDeactivatedEventHandler>();
        }
        */

        public static void AddStorage<T>(this IServiceCollection serviceCollection) where T : Storage, IStorage
        {
            serviceCollection.AddScoped<IStorage, T>();
            serviceCollection.AddScoped<IStorageService, StorageService>();
        }

        public static void AddToken(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddScoped<ITokenHandler, TokenHandler>();
        }

        public static void AddStorage(this IServiceCollection serviceCollection, StorageType storageType)
        {
            switch (storageType)
            {
                case StorageType.Local:
                    serviceCollection.AddScoped<IStorage, LocalStorage>();
                    break;
                case StorageType.Azure:

                    break;
                case StorageType.AWS:
                    break;
                default:
                    serviceCollection.AddScoped<IStorage, LocalStorage>();
                    break;
            }
            serviceCollection.AddScoped<IStorageService, StorageService>();
        }
    }
}
