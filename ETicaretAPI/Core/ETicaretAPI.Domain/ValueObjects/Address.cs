using System.Collections.Generic;
using ETicaretAPI.Domain.Common;

namespace ETicaretAPI.Domain.ValueObjects
{
    public class Address : ValueObject
    {
        public required string Street { get; init; }
        public required string City { get; init; }
        public required string State { get; init; }
        public required string Country { get; init; }
        public required string ZipCode { get; init; }

        private Address() { } // For EF Core

        public Address(string street, string city, string state, string country, string zipCode)
        {
            if (string.IsNullOrWhiteSpace(street))
                throw new DomainException("Street cannot be empty");

            if (string.IsNullOrWhiteSpace(city))
                throw new DomainException("City cannot be empty");

            if (string.IsNullOrWhiteSpace(state))
                throw new DomainException("State cannot be empty");

            if (string.IsNullOrWhiteSpace(country))
                throw new DomainException("Country cannot be empty");

            if (string.IsNullOrWhiteSpace(zipCode))
                throw new DomainException("Zip code cannot be empty");

            Street = street;
            City = city;
            State = state;
            Country = country;
            ZipCode = zipCode;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Street;
            yield return City;
            yield return State;
            yield return Country;
            yield return ZipCode;
        }
    }
} 