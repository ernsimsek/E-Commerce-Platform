using ETicaretAPI.Domain.Common;
using ETicaretAPI.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Domain.Entites
{
    public class Customer : BaseEntity
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public string PhoneNumber { get; private set; }
        public Address ShippingAddress { get; private set; }
        public Address BillingAddress { get; private set; }

        private Customer() { } // For EF Core

        public Customer(string firstName, string lastName, string email, string phoneNumber, Address shippingAddress, Address billingAddress)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new DomainException("First name cannot be empty");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new DomainException("Last name cannot be empty");

            if (string.IsNullOrWhiteSpace(email))
                throw new DomainException("Email cannot be empty");

            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new DomainException("Phone number cannot be empty");

            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            ShippingAddress = shippingAddress;
            BillingAddress = billingAddress;
        }

        public void UpdateContactInfo(string email, string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new DomainException("Email cannot be empty");

            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new DomainException("Phone number cannot be empty");

            Email = email;
            PhoneNumber = phoneNumber;
        }

        public void UpdateAddresses(Address shippingAddress, Address billingAddress)
        {
            ShippingAddress = shippingAddress;
            BillingAddress = billingAddress;
        }
    }
}
