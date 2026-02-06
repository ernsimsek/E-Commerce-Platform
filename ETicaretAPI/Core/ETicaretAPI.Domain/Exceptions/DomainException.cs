using System;

namespace ETicaretAPI.Domain.Exceptions
{
    public class DomainException : Exception
    {
        public DomainException() : base("A domain error occurred")
        {
        }

        public DomainException(string message) : base(message)
        {
        }

        public DomainException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }
} 