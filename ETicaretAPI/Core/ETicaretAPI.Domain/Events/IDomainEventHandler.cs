using System.Threading.Tasks;

namespace ETicaretAPI.Domain.Events
{
    public interface IDomainEventHandler<in TEvent> where TEvent : IDomainEvent
    {
        Task HandleAsync(TEvent @event);
    }
} 