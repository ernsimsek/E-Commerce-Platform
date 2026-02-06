using System;

namespace ETicaretAPI.Domain.Common
{
    public abstract class DomainEvent
    {
        public DateTime OccurredOn { get; }

        protected DomainEvent()
        {
            OccurredOn = DateTime.UtcNow;
        }
    }
} 