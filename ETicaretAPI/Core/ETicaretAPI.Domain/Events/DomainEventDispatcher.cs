using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ETicaretAPI.Domain.Events
{
    public interface IDomainEventDispatcher
    {
        Task DispatchEventsAsync(IEnumerable<DomainEvent> events);
    }

    public class DomainEventDispatcher : IDomainEventDispatcher
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DomainEventDispatcher> _logger;

        public DomainEventDispatcher(
            IServiceProvider serviceProvider,
            ILogger<DomainEventDispatcher> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task DispatchEventsAsync(IEnumerable<DomainEvent> events)
        {
            foreach (var @event in events)
            {
                var eventType = @event.GetType();
                var handlerType = typeof(IDomainEventHandler<>).MakeGenericType(eventType);

                using var scope = _serviceProvider.CreateScope();
                var handlers = scope.ServiceProvider.GetServices(handlerType);

                foreach (var handler in handlers)
                {
                    try
                    {
                        await (Task)handlerType
                            .GetMethod("HandleAsync")
                            .Invoke(handler, new object[] { @event });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error handling domain event {EventType}", eventType.Name);
                    }
                }
            }
        }
    }
} 