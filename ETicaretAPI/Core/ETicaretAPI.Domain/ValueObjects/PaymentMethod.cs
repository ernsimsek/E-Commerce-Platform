using System.Collections.Generic;
using ETicaretAPI.Domain.Common;

namespace ETicaretAPI.Domain.ValueObjects
{
    public class PaymentMethod : ValueObject
    {
        public required string Type { get; init; }
        public required string CardNumber { get; init; }
        public required string CardHolderName { get; init; }
        public required string ExpirationDate { get; init; }
        public required string Cvv { get; init; }

        private PaymentMethod() { } // For EF Core

        public PaymentMethod(string type, string cardNumber, string cardHolderName, string expirationDate, string cvv)
        {
            if (string.IsNullOrWhiteSpace(type))
                throw new DomainException("Payment type cannot be empty");

            if (string.IsNullOrWhiteSpace(cardNumber))
                throw new DomainException("Card number cannot be empty");

            if (string.IsNullOrWhiteSpace(cardHolderName))
                throw new DomainException("Card holder name cannot be empty");

            if (string.IsNullOrWhiteSpace(expirationDate))
                throw new DomainException("Expiration date cannot be empty");

            if (string.IsNullOrWhiteSpace(cvv))
                throw new DomainException("CVV cannot be empty");

            if (!IsValidCardNumber(cardNumber))
                throw new DomainException("Invalid card number");

            if (!IsValidExpirationDate(expirationDate))
                throw new DomainException("Invalid expiration date");

            if (!IsValidCVV(cvv))
                throw new DomainException("Invalid CVV");

            Type = type;
            CardNumber = MaskCardNumber(cardNumber);
            CardHolderName = cardHolderName;
            ExpirationDate = expirationDate;
            Cvv = "***";
        }

        private bool IsValidCardNumber(string cardNumber)
        {
            // Luhn algorithm implementation
            int sum = 0;
            bool alternate = false;

            // Loop through values starting from the rightmost side
            for (int i = cardNumber.Length - 1; i >= 0; i--)
            {
                int n = int.Parse(cardNumber[i].ToString());
                if (alternate)
                {
                    n *= 2;
                    if (n > 9)
                    {
                        n = (n % 10) + 1;
                    }
                }
                sum += n;
                alternate = !alternate;
            }

            return (sum % 10 == 0);
        }

        private bool IsValidExpirationDate(string expirationDate)
        {
            if (!DateTime.TryParseExact(expirationDate, "MM/yy", null, System.Globalization.DateTimeStyles.None, out DateTime expDate))
                return false;

            return expDate > DateTime.Now;
        }

        private bool IsValidCVV(string cvv)
        {
            return cvv.Length >= 3 && cvv.Length <= 4 && cvv.All(char.IsDigit);
        }

        private string MaskCardNumber(string cardNumber)
        {
            return $"****-****-****-{cardNumber.Substring(cardNumber.Length - 4)}";
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Type;
            yield return CardNumber;
            yield return CardHolderName;
            yield return ExpirationDate;
            yield return Cvv;
        }
    }
} 