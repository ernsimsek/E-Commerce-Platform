using System;
using ETicaretAPI.Domain.Common;

namespace ETicaretAPI.Domain.ValueObjects
{
    public class Money : ValueObject
    {
        public decimal Amount { get; private set; }
        public string Currency { get; private init; }

        private Money() { } // For EF Core

        public Money(decimal amount, string currency)
        {
            if (string.IsNullOrWhiteSpace(currency))
                throw new DomainException("Currency cannot be empty");

            Amount = amount;
            Currency = currency;
        }

        public static Money Create(decimal amount, string currency)
        {
            return new Money(amount, currency);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Amount;
            yield return Currency;
        }

        public static Money operator +(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot add money with different currencies");

            return new Money(left.Amount + right.Amount, left.Currency);
        }

        public static Money operator -(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot subtract money with different currencies");

            return new Money(left.Amount - right.Amount, left.Currency);
        }

        public static Money operator *(Money money, decimal multiplier)
        {
            return new Money(money.Amount * multiplier, money.Currency);
        }

        public static Money operator /(Money money, decimal divisor)
        {
            if (divisor == 0)
                throw new DomainException("Cannot divide by zero");

            return new Money(money.Amount / divisor, money.Currency);
        }

        public static bool operator <(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot compare money with different currencies");

            return left.Amount < right.Amount;
        }

        public static bool operator >(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot compare money with different currencies");

            return left.Amount > right.Amount;
        }

        public static bool operator <=(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot compare money with different currencies");

            return left.Amount <= right.Amount;
        }

        public static bool operator >=(Money left, Money right)
        {
            if (left.Currency != right.Currency)
                throw new DomainException("Cannot compare money with different currencies");

            return left.Amount >= right.Amount;
        }
    }
} 