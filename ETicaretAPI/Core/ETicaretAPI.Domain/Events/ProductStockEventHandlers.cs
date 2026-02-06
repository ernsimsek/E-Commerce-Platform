using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ETicaretAPI.Domain.Events
{
    public class ProductStockIncreasedEventHandler : IDomainEventHandler<ProductStockIncreasedEvent>
    {
        private readonly ILogger<ProductStockIncreasedEventHandler> _logger;

        public ProductStockIncreasedEventHandler(ILogger<ProductStockIncreasedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(ProductStockIncreasedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} stock increased by {Quantity}",
                @event.Product.Id,
                @event.Quantity);
            return Task.CompletedTask;
        }
    }

    public class ProductStockDecreasedEventHandler : IDomainEventHandler<ProductStockDecreasedEvent>
    {
        private readonly ILogger<ProductStockDecreasedEventHandler> _logger;

        public ProductStockDecreasedEventHandler(ILogger<ProductStockDecreasedEventHandler> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(ProductStockDecreasedEvent @event)
        {
            _logger.LogInformation(
                "Product {ProductId} stock decreased by {Quantity}",
                @event.Product.Id,
                @event.Quantity);
            return Task.CompletedTask;
        }
    }
} 