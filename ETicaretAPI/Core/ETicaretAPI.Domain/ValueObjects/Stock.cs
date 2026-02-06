using System;
using ETicaretAPI.Domain.Common;

namespace ETicaretAPI.Domain.ValueObjects
{
    public class Stock : ValueObject
    {
        public int Value { get; private set; }

        private Stock() { } // For EF Core

        public Stock(int value)
        {
            if (value < 0)
                throw new DomainException("Stock cannot be negative");

            Value = value;
        }

        public static Stock Create(int value)
        {
            return new Stock(value);
        }

        public Stock Add(int quantity)
        {
            if (quantity < 0)
                throw new DomainException("Quantity cannot be negative");

            return new Stock(Value + quantity);
        }

        public Stock Subtract(int quantity)
        {
            if (quantity < 0)
                throw new DomainException("Quantity cannot be negative");

            if (Value < quantity)
                throw new DomainException("Insufficient stock");

            return new Stock(Value - quantity);
        }

        public static Stock operator +(Stock stock, int quantity)
        {
            return stock.Add(quantity);
        }

        public static Stock operator -(Stock stock, int quantity)
        {
            return stock.Subtract(quantity);
        }

        public static bool operator <(Stock stock, int value)
        {
            return stock.Value < value;
        }

        public static bool operator >(Stock stock, int value)
        {
            return stock.Value > value;
        }

        public static bool operator <=(Stock stock, int value)
        {
            return stock.Value <= value;
        }

        public static bool operator >=(Stock stock, int value)
        {
            return stock.Value >= value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
} 